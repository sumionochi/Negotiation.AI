//supported languages - en,es,de,fr,hi,ur,ta,mr,ko,gu,bn

import { create } from "zustand";
import { Subscription } from "../types/Subscription";

export type LanguageSuppport = 
  | "en"
  | "hi"
  | "ja"
  | "ur"
  | "ta"
  | "mr"
  | "ko"
  | "gu"
  | "bn"
  | "de"
  | "fr";

const Lang_free = 5;  

export const LanguageSuppportMap: Record<LanguageSuppport, string> = {
    en: "English",
    hi: "Hindi",
    de: "German",
    fr: "French",
    ja: "Japanese",
    ur: "Urdu",
    ta: "Tamil",
    mr: "Marathi",
    ko: "Korean",
    gu: "Gujarati",
    bn: "Bengali"
}  

interface LanguageState{
    language: LanguageSuppport;
    setLanguage: (language: LanguageSuppport) =>void;
    getLanguage: (Pro: boolean) => LanguageSuppport[];
    getNotSupportedLanguages: (Pro: boolean) => LanguageSuppport[]; 
}

export const useLanguageStore = create<LanguageState>()((set, get)=>({
    language: "en",
    setLanguage: (language: LanguageSuppport)=>set({language}),
    getLanguage: (Pro: boolean)=> {
        if(Pro) return Object.keys(LanguageSuppportMap) as LanguageSuppport[];
        return Object.keys(LanguageSuppportMap).slice(0,Lang_free) as LanguageSuppport[];
    },
    getNotSupportedLanguages: (Pro: boolean)=>{
        if(Pro) return [];
        return Object.keys(LanguageSuppportMap).slice(Lang_free) as LanguageSuppport[];
    }

}))

interface SubscriptionState {
    subscription: Subscription | null | undefined;
    setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set)=>({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set ({subscription}),
}))