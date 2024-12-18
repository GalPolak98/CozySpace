import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, TranslationType } from "@/constants/translations";
import * as Updates from "expo-updates";
import * as Localization from "expo-localization";

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  isRTL: boolean;
  t: TranslationType;
  getGenderedText: (
    text: string | { male: string; female: string; default: string },
    gender?: string
  ) => string;
}

const LANGUAGE_KEY = "@app_language";
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const deviceLocales = Localization.getLocales();
    const deviceLanguage = deviceLocales[0]?.languageCode;
    return deviceLanguage === "he" ? "he" : "en";
  });

  const isRTL = currentLanguage === "he";
  const t =
    translations[currentLanguage as keyof typeof translations].translation;

  const getGenderedText = (
    text: string | { male: string; female: string; default: string },
    gender?: string
  ): string => {
    if (typeof text === "string") return text;

    if (gender === "male") return text.male;
    if (gender === "female") return text.female;
    return text.default;
  };

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        } else {
          const deviceLocales = Localization.getLocales();
          const deviceLanguage = deviceLocales[0]?.languageCode;
          const initialLanguage = deviceLanguage === "he" ? "he" : "en";
          await AsyncStorage.setItem(LANGUAGE_KEY, initialLanguage);
          setCurrentLanguage(initialLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setCurrentLanguage(lang);
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        isRTL,
        t,
        getGenderedText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
