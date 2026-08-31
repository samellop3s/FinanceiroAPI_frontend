// Dark Mode Toggle - persiste a preferência no localStorage
(function () {
    const THEME_KEY = "financeiro-theme";

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        // Respeita a preferência do sistema operacional
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
        updateIcon(theme);
    }

    function updateIcon(theme) {
        const iconEl = document.querySelector(".dark-mode-toggle .icon");
        if (iconEl) {
            iconEl.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
    }

    // Aplica o tema ANTES do DOM carregar para evitar flash
    applyTheme(getPreferredTheme());

    // Quando o DOM estiver pronto, conecta o botão
    document.addEventListener("DOMContentLoaded", function () {
        const btn = document.getElementById("btnDarkMode");
        if (btn) {
            btn.addEventListener("click", toggleTheme);
            // Atualiza o ícone após o DOM estar pronto
            updateIcon(getPreferredTheme());
        }
    });
})();
