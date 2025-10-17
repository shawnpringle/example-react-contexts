import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const DEFAULT_LANGUAGE = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Detect browser language (keep simple, use first two chars)
  const browserLang = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : DEFAULT_LANGUAGE;

  const [language, setLanguage] = useState<Language>(browserLang || DEFAULT_LANGUAGE);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export default LanguageContext;
