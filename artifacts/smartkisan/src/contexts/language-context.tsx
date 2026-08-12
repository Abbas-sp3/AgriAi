import { createContext, useState, type ReactNode } from "react";
import { type LangCode, type T, t as tFn, LANGUAGE_META } from "@/lib/i18n";

export interface LanguageContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof T) => string;
  voiceCode: string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>("en");

  const t = (key: keyof T) => tFn(lang, key);
  const voiceCode = LANGUAGE_META[lang].voice;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, voiceCode }}>
      {children}
    </LanguageContext.Provider>
  );
}
