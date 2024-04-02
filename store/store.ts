//supported languages - en,hi,bn,gu,as,bho,doi,kn,mai,ml,mr,ne,or,pa,sa,ta,te,ur

import { create } from "zustand";
import { Subscription } from "../types/Subscription";

export type LanguageSuppport =
  | "en"
  | "hi"
  | "bn"
  | "gu"
  | "as"
  | "bho"
  | "doi"
  | "kn"
  | "mai"
  | "ml"
  | "mr"
  | "ne"
  | "or"
  | "pa"
  | "sa"
  | "ta"
  | "te"
  | "ur";

const Lang_free = 5;

export const LanguageSuppportMap: Record<LanguageSuppport, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  gu: "Gujarati",
  as: "Assamese",
  bho: "Bhojpuri",
  doi: "Dogri",
  kn: "Kannada",
  mai: "Maithili",
  ml: "Malayalam",
  mr: "Marathi",
  ne: "Nepali",
  or: "Odia",
  pa: "Punjabi",
  sa: "Sanskrit",
  ta: "Tamil",
  te: "Telugu",
  ur: "Urdu",
};

interface LanguageState {
  language: LanguageSuppport;
  setLanguage: (language: LanguageSuppport) => void;
  getLanguage: (Pro: boolean) => LanguageSuppport[];
  getNotSupportedLanguages: (Pro: boolean) => LanguageSuppport[];
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  language: "en",
  setLanguage: (language: LanguageSuppport) => set({ language }),
  getLanguage: (Pro: boolean) => {
    if (Pro) return Object.keys(LanguageSuppportMap) as LanguageSuppport[];
    return Object.keys(LanguageSuppportMap).slice(
      0,
      Lang_free
    ) as LanguageSuppport[];
  },
  getNotSupportedLanguages: (Pro: boolean) => {
    if (Pro) return [];
    return Object.keys(LanguageSuppportMap).slice(
      Lang_free
    ) as LanguageSuppport[];
  },
}));

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
