(function () {
    "use strict";

    // ---- Pricing config (price per logement, monthly) ----
    var PRICES = {
        gratuit: 0,
        premium: 5.99,
        pro: 9.99
    };
    var ANNUAL_DISCOUNT = 0.20; // 20% off when billed annually
    var GRATUIT_MAX = 2;
    var CUSTOM_THRESHOLD = 20;

    var t = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0
        ? {
            monthSuffix: "HT/month/property",
            totalMonthly: "Total: {v}/month",
            totalYearly: "Total: {v}/year (billed annually)",
            gratuitCap: "Limited to " + GRATUIT_MAX + " properties",
            customHint: "Custom plan recommended (20+ properties)"
        }
        : {
            monthSuffix: "HT/mois/logement",
            totalMonthly: "Total : {v}/mois",
            totalYearly: "Total : {v}/an (facturé annuellement)",
            gratuitCap: "Limité à " + GRATUIT_MAX + " logements",
            customHint: "Plan personnalisé recommandé (20+ logements)"
        };

    var state = {
        logements: 1,
        annual: false
    };

    var fmt = function (v) {
        var rounded = Math.round(v * 100) / 100;
        return rounded.toFixed(2).replace(".", ",") + " €";
    };

    var fmtPerProperty = function (v) {
        // e.g. 5,99 €
        return v.toFixed(2).replace(".", ",") + " €";
    };

    function update() {
        var n = state.logements;
        var annual = state.annual;
        var factor = annual ? (1 - ANNUAL_DISCOUNT) : 1;

        // Per-property displayed prices (with annual discount applied)
        var premiumPer = PRICES.premium * factor;
        var proPer = PRICES.pro * factor;

        var els = document.querySelectorAll("[data-price]");
        els.forEach(function (el) {
            var plan = el.getAttribute("data-price");
            if (plan === "premium") el.textContent = fmtPerProperty(premiumPer);
            if (plan === "pro") el.textContent = fmtPerProperty(proPer);
        });

        // Totals
        var totals = {
            gratuit: 0,
            premium: premiumPer * n * (annual ? 12 : 1),
            pro: proPer * n * (annual ? 12 : 1)
        };

        var totalEls = document.querySelectorAll("[data-total]");
        totalEls.forEach(function (el) {
            var plan = el.getAttribute("data-total");
            if (plan === "gratuit") {
                el.textContent = n > GRATUIT_MAX ? t.gratuitCap : (annual
                    ? t.totalYearly.replace("{v}", fmt(0))
                    : t.totalMonthly.replace("{v}", fmt(0)));
                return;
            }
            if (plan === "custom") {
                el.textContent = n >= CUSTOM_THRESHOLD ? t.customHint : "";
                el.style.display = n >= CUSTOM_THRESHOLD ? "inline-block" : "none";
                return;
            }
            var val = totals[plan];
            if (val === undefined) return;
            el.textContent = annual
                ? t.totalYearly.replace("{v}", fmt(val))
                : t.totalMonthly.replace("{v}", fmt(val));
        });

        // Counter display + buttons state
        var valueEl = document.querySelector("[data-counter-value]");
        if (valueEl) valueEl.textContent = n;
        var dec = document.querySelector("[data-counter-dec]");
        if (dec) dec.disabled = n <= 1;

        // Toggle labels
        document.querySelectorAll("[data-billing]").forEach(function (el) {
            var billing = el.getAttribute("data-billing");
            el.classList.toggle("active-label", (billing === "annual") === annual);
        });
        var switchEl = document.querySelector("[data-switch]");
        if (switchEl) switchEl.classList.toggle("is-annual", annual);
    }

    function init() {
        // Counter
        var inc = document.querySelector("[data-counter-inc]");
        var dec = document.querySelector("[data-counter-dec]");
        if (inc) inc.addEventListener("click", function () {
            state.logements = Math.min(state.logements + 1, 99);
            update();
        });
        if (dec) dec.addEventListener("click", function () {
            state.logements = Math.max(state.logements - 1, 1);
            update();
        });

        // Billing switch
        var sw = document.querySelector("[data-switch]");
        if (sw) sw.addEventListener("click", function () {
            state.annual = !state.annual;
            update();
        });
        document.querySelectorAll("[data-billing]").forEach(function (el) {
            el.addEventListener("click", function () {
                state.annual = el.getAttribute("data-billing") === "annual";
                update();
            });
        });

        // Contact dropdown
        var ddBtn = document.querySelector("[data-dropdown-trigger]");
        var dd = document.querySelector("[data-dropdown]");
        if (ddBtn && dd) {
            ddBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                dd.classList.toggle("open");
            });
            document.addEventListener("click", function (e) {
                if (!dd.contains(e.target) && e.target !== ddBtn) dd.classList.remove("open");
            });
        }

        // Mobile menu
        var menuBtn = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (menuBtn && nav) {
            menuBtn.addEventListener("click", function () {
                nav.classList.toggle("open");
            });
            nav.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () {
                    if (window.innerWidth <= 720) nav.classList.remove("open");
                });
            });
        }

        update();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
