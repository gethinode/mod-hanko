(function () {
    function init() {
        var placeholder = document.getElementById("auth-placeholder");
        var fallback = document.getElementById("auth-fallback");
        if (!placeholder || !fallback || !window.customElements) return;

        var tag = placeholder.dataset.authTag;
        if (!tag) return;

        var timeoutMs = 3000;
        var reloadDelayMs = 12000;
        var reloadKey = "hanko-login-reloaded";

        var upgraded = false;
        customElements.whenDefined(tag).then(function () {
            upgraded = true;
            try { sessionStorage.removeItem(reloadKey); } catch (e) {}
        });

        setTimeout(function () {
            if (upgraded) return;
            placeholder.hidden = true;
            fallback.hidden = false;
            try {
                if (sessionStorage.getItem(reloadKey)) return;
                sessionStorage.setItem(reloadKey, "1");
            } catch (e) { return; }
            setTimeout(function () { window.location.reload(); }, reloadDelayMs);
        }, timeoutMs);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
