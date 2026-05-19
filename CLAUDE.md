# GuestLucky — Mémoire projet

Site vitrine **GuestLucky** (SaaS de gestion location courte durée).
Repo : `xSARRASx/mon-premier-projet`. Branche de travail : `claude/work-in-progress-sKXoW`.

---

## Stack & structure

- Site **statique** : HTML/CSS/JS vanilla + 1 PHP (`register-webinar.php`)
- Pas de framework, pas de build step
- Bilingue **FR + EN** : chaque page a sa version `-en.html`
- Feuille de style unique `style.css` (~66 Ko, ~2000 lignes)
- Script global `app.js`
- `sitemap.xml` + `robots.txt`

### Pages
`index` · `fonctionnalites` · `tarifs` · `faq` · `contact` · `demo` · `pour-qui` · `webinaire` · `merci-webinaire` (+ alias `merciwebinaire` sans tiret, pour les params WebinarJam)

---

## Charte visuelle (variables CSS, voir `:root` dans style.css)

| Rôle | Couleur |
|---|---|
| Navy (header, sections sombres) | `#1a2547` / `#232f55` / `#131a36` |
| Violet primaire | `#6b46ff` |
| Violet foncé | `#4f33d9` |
| Violet clair | `#a48bff` |
| Violet soft (fonds) | `#eee9ff` |
| Rose accent | `#e91e8c` / `#ff63b8` |
| Background | `#f6f3ff` |
| Texte | `#0f0f1f` / `#3a3a4a` / `#6b6b80` |

- Police : **Inter** (400 → 800)
- Radius : 18px / 28px / pill (999px)
- Ombres violettes (`--shadow-md`, `--shadow-lg`)
- Animations : blobs flottants, pulse, glow webinar
- Logo : SVG (maison stylisée + accent rose) + version PNG `.logo-img`

---

## Composants présents dans le CSS

- **Header** sticky navy, nav 5 entrées, dropdown langue (globe), bouton CTA "Réserver une démo" → menu WhatsApp/Email
- **Hero** : badge pulsant, h1 gradient accent, lead, pills, blobs animés
- **Sections** : eyebrow pill + h2 avec mot en gradient + lead centré
- **Cards** : `feature` (mind-map), `audience-card`, `partner`, `step`, `testimonial`, `contact-card`
- **Pricing** : 4 plans (Gratuit / Premium / Pro / Personnalisé), toggle mensuel↔annuel (-20%), compteur de logements, plan-total dynamique, plan `is-popular` avec badge
- **FAQ** : accordéon avec toggle `+` qui rotate
- **Demo** : embed iClosed
- **Footer** : 4 colonnes (brand, produit, ressources, légal)
- **Bulles flottantes** : WhatsApp + Email en bas à droite
- **Webinar promo** : carte gradient violet→rose avec date + CTA
- **Webinar float** : carte flottante en bas à gauche
- **Cookie banner** RGPD
- Responsive : breakpoints 1180 / 1024 / 980 / 820 / 720 / 420

---

## Intégrations & contraintes

- **WhatsApp** : `07 59 94 43 05` (ne pas confondre avec l'ancien `07 59 89 44 30`). Présent dans HTML, PHP, JSON-LD.
- **Email** : `contact@guestlucky.com`
- **GTM container** : `GTM-WB4NPPJW`
- **Webinaire** : redirection One-Click WebinarJam, page de remerciement `merci-webinaire.html` lit `wj_lead_first_name` ; PHP backend `register-webinar.php` fait l'enregistrement WJ via curl
- **Demo** : embed iClosed (iframe, min-height 720px desktop / 600 tablet / 540 mobile)
- **Images showcase** hébergées sur `https://www.locationcourteduree.fr/wp-content/uploads/2026/05/`

---

## Sections fonctionnalités (à intégrer / déjà préparées)

Liste des 16 sections de l'app GuestLucky avec leurs screenshots :

| Section | Notes |
|---|---|
| Analytics | 3 captures |
| Mes annonces | 2 captures |
| Calendrier | 1 capture |
| Réservations | 2 captures |
| Tarification | 3 captures |
| PriceLabs | 1 capture (intégration partenaire) |
| Messagerie | 3-4 captures |
| Auto actions | 1 capture |
| Avis clients | 1 capture — ⚠️ **lecture seule, on ne peut pas répondre aux avis depuis GuestLucky** |
| Compte | 2 captures |
| Mes facturations | 1 capture (JPG) |
| Réclamation et avis | 2 captures |
| Incidents | 1 capture |
| Services additionnels | 1 capture |
| Stock | 1 capture |
| Discussion | 1 capture — entre prestataires de ménage et propriétaires, **dans GuestLucky** |

URLs complètes : voir l'historique de conversation. Format `https://www.locationcourteduree.fr/wp-content/uploads/2026/05/Capture-decran-2026-05-19-a-HH.MM.SS.png`.

---

## Règles de travail

### Git
- **Toujours développer sur la branche** `claude/work-in-progress-sKXoW`
- Commit + push systématique (l'environnement est éphémère, rien n'est conservé sans push)
- `git push -u origin <branche>` ; retry exponentiel 2/4/8/16s si erreur réseau
- Ne **jamais** push sur `main` sans accord explicite
- Ne **pas** créer de PR sans demande explicite
- Messages de commit clairs et descriptifs
- Stager les fichiers nommément (pas `git add -A`)

### Code
- **Préserver la charte** (variables CSS, classes existantes) pour toute nouvelle page/section
- **Bilingue obligatoire** : toute modif de page FR doit avoir sa contrepartie EN (`*-en.html`)
- **Responsive strict** : respecter les breakpoints 980/720/420, utiliser `clamp()` pour les tailles fluides, garder les règles anti-débordement (`overflow-x`, `min-width:0`, `minmax(0,1fr)`, `max-width: 100%` sur images)
- Réutiliser les composants CSS existants (`.feature`, `.section`, `.section-head`, `.plan`, etc.) plutôt que d'inventer de nouveaux styles
- Garder le header/footer cohérents entre toutes les pages
- Numéro WhatsApp, email, GTM : ne pas modifier sans demande

### Communication
- Le user écrit principalement en **français**, répondre en français
- Concis et direct
- Avant gros changements (nouvelle page, refonte section), proposer titres/descriptions à valider

---

## Historique commits notables (pour contexte)

- `4cb3aa1` Responsive showcase : règles anti-débordement
- `201e0bd` Showcase : URLs externes locationcourteduree.fr
- `11f6462` Section "L'outil en action" avec 5 captures (FR+EN)
- `6046397` Maj WhatsApp 07 59 89 44 30 → 07 59 94 43 05
- `8b09c71` Alias merciwebinaire.html + lecture params WJ
- `99e8d11` Redirection vers merci-webinaire.html après inscription
- `5cc5d51` Redirection directe One-Click WJ (au lieu de curl serveur)
- `7635d99` GTM `GTM-TVTMXZG2` → `GTM-WB4NPPJW`
- `bf9e25b` Page remerciement webinaire FR+EN (calendrier + partage)
- `70e8261` PHP backend curl URL One-Click (iframes WJ bloquées)
