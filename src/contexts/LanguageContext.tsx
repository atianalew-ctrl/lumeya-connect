import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, TranslationKey } from "@/lib/translations";

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // Auto-detect browser language
    const saved = localStorage.getItem("lumeya_lang") as Language | null;
    if (saved && ["en", "da", "no", "sv"].includes(saved)) return saved;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    if (browser === "da") return "da";
    if (browser === "nb" || browser === "nn" || browser === "no") return "no";
    if (browser === "sv") return "sv";
    return "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("lumeya_lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
