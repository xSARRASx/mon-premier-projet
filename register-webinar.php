<?php
/**
 * GuestLucky — Webinar registration backend
 *
 * Receives form data from webinaire.html / webinaire-en.html
 * and registers the user in WebinarJam via their API.
 *
 * ============================================================
 * CONFIGURATION REQUISE (à remplir avant utilisation)
 * ============================================================
 * 1. Connecte-toi sur ton dashboard WebinarJam
 * 2. Va dans "Account" > "API" pour récupérer ta clé API
 * 3. Va sur la page du webinaire pour récupérer le webinar_id
 * 4. Remplis les 3 constantes ci-dessous
 * ============================================================
 */

const WEBINARJAM_API_KEY = 'TA_CLE_API_ICI';        // ex: "abc123xyz..."
const WEBINARJAM_WEBINAR_ID = 'TON_WEBINAR_ID_ICI'; // ex: "12345"
const WEBINARJAM_SCHEDULE = 0;                       // 0 = premier créneau dispo (généralement OK)

// Email où recevoir une copie des inscriptions (optionnel, mettre "" pour désactiver)
const NOTIFY_EMAIL = 'contact@guestlucky.com';

// ============================================================
// NE PAS MODIFIER EN DESSOUS
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Restreindre à ton domaine en prod

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Validation des champs requis
$firstname = trim($_POST['firstname'] ?? '');
$lastname  = trim($_POST['lastname'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = trim($_POST['phone'] ?? '');
$consent   = isset($_POST['consent']);

if (!$firstname || !$lastname || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$consent) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Champs manquants ou invalides']);
    exit;
}

// Appel à l'API WebinarJam
$payload = [
    'api_key'    => WEBINARJAM_API_KEY,
    'webinar_id' => WEBINARJAM_WEBINAR_ID,
    'first_name' => $firstname,
    'last_name'  => $lastname,
    'email'      => $email,
    'schedule'   => WEBINARJAM_SCHEDULE,
];
if ($phone) $payload['phone_country_code'] = '+33';
if ($phone) $payload['phone'] = preg_replace('/\D/', '', $phone);

$ch = curl_init('https://api.webinarjam.com/v2/webinar/register');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($payload),
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
]);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_err = curl_error($ch);
curl_close($ch);

$wjData = json_decode($response, true);

// Notification email à l'admin (optionnel)
if (NOTIFY_EMAIL) {
    $subject = "[Webinaire GuestLucky] Nouvelle inscription : $firstname $lastname";
    $body  = "Nouvelle inscription au webinaire :\n\n";
    $body .= "Prénom : $firstname\n";
    $body .= "Nom : $lastname\n";
    $body .= "Email : $email\n";
    if ($phone) $body .= "Téléphone : $phone\n";
    $body .= "\nSource : " . ($_POST['source'] ?? 'webinaire.html') . "\n";
    $body .= "Date : " . date('Y-m-d H:i:s') . "\n\n";
    $body .= "Réponse WebinarJam (HTTP $http_code) :\n" . substr($response ?: 'aucune', 0, 500);
    @mail(NOTIFY_EMAIL, $subject, $body, "From: noreply@guestlucky.com\r\n");
}

// Réponse au front
if ($http_code === 200 && isset($wjData['status']) && $wjData['status'] === 'success') {
    echo json_encode([
        'ok' => true,
        'message' => 'Inscription confirmée',
        'webinarjam' => $wjData,
    ]);
} else {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Erreur API WebinarJam',
        'http_code' => $http_code,
        'webinarjam_response' => $wjData ?: $response,
        'curl_error' => $curl_err,
    ]);
}
