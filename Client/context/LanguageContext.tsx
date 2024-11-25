import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Updates from 'expo-updates';
// import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '@/constants/translations';
import { I18nManager } from 'react-native';

// i18n.use(initReactI18next).init({
//   resources: translations,
//   lng: 'en',
//   fallbackLng: 'en',
//   interpolation: { escapeValue: false },
// });
type TranslationType = typeof translations['en']['translation'];

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  isChangingLanguage: boolean;
  isRTL: boolean;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
const isRTL = currentLanguage === 'he';
const t = currentLanguage === 'he' ? translations['he']['translation'] : translations['en']['translation']


  const changeLanguage = async (lang: string) => {
    try {
      setIsChangingLanguage(true);
      setCurrentLanguage(lang);
 
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      isChangingLanguage,
      isRTL,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
      throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
  };
