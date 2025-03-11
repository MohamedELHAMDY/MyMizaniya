import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  setLanguage: (lang: string) => void;
  language: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ setLanguage, language }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <select
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="bg-transparent text-white border-none focus:outline-none"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
  );
};

export default LanguageSelector;