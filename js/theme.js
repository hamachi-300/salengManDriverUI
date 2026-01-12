function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

// Run on load
initTheme();
// We need to wait for translations.js to load if it's included via script tag
// Or we assume it's loaded before theme.js or we make theme.js dependent on it.
// Ideally, we should check if 'translations' exists.

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
});

function initLanguage() {
    const lang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('language', newLang);
    document.documentElement.setAttribute('lang', newLang);
    applyTranslations(newLang);
}

function applyTranslations(lang) {
    if (typeof translations === 'undefined') {
        console.warn('Translations object not found. Make sure translations.js is included.');
        return;
    }

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];

        if (translation) {
            // Check if it's an input with placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    // If we want to translate placeholder specifically, we might need a convention
                    // For now, let's assume data-i18n targets placeholder for inputs if innerText isn't appropriate
                    // But usually data-i18n targets text content.
                    // Let's check if there is a specific attribute or just use innerText
                }
                // For this implementation, let's support data-i18n-placeholder
            } else {
                element.innerText = translation;
            }
        }
    });

    // Handle placeholders separately
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = translations[lang][key];
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });
}
