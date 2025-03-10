import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import ber from './locales/ber.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
      ber: { translation: ber }
    },
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;