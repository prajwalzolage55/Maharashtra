/**
 * Maharashtra: Unity in Diversity 2026
 * Internationalization (i18n) Engine — English & Marathi
 * Department of Artificial Intelligence & Data Science
 */

const i18n = {
  currentLang: 'en',
  translations: {
    en: null,
    mr: null
  },

  async init() {
    const savedLang = localStorage.getItem('mh_lang') || 'en';
    this.currentLang = savedLang;

    try {
      const [enRes, mrRes] = await Promise.all([
        fetch('data/en.json'),
        fetch('data/mr.json')
      ]);

      this.translations.en = await enRes.json();
      this.translations.mr = await mrRes.json();

      this.applyLanguage(this.currentLang);
      this.setupToggle();
    } catch (err) {
      console.warn('Could not load translation files locally:', err);
    }
  },

  setLanguage(lang) {
    if (!['en', 'mr'].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('mh_lang', lang);
    document.body.setAttribute('data-lang', lang);
    this.applyLanguage(lang);

    const langText = document.getElementById('langText');
    if (langText) {
      langText.textContent = lang === 'en' ? 'मराठी' : 'English';
    }

    if (window.renderCharts) {
      window.renderCharts();
    }
  },

  applyLanguage(lang) {
    const data = this.translations[lang];
    if (!data) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.getNestedValue(data, key);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', val);
        } else {
          el.textContent = val;
        }
      }
    });

    document.documentElement.lang = lang;
  },

  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  },

  setupToggle() {
    const langBtn = document.getElementById('langToggle');
    const langText = document.getElementById('langText');

    if (langText) {
      langText.textContent = this.currentLang === 'en' ? 'मराठी' : 'English';
    }

    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const nextLang = this.currentLang === 'en' ? 'mr' : 'en';
        this.setLanguage(nextLang);
      });
    }
  }
};

window.i18n = i18n;
document.addEventListener('DOMContentLoaded', () => i18n.init());
