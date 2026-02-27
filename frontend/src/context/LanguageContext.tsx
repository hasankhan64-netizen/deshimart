"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage } from "@/lib/utils";

type Language = "en" | "bn" | "ur" | "hi" | "ne" | "si" | "vi" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search in any language...",
    search: "Search",
    resultsFor: "Results for",
    fromYourCountry: "From your country",
    fromOtherCountries: "From other countries",
    noResults: "No products found. Try different keywords.",
  },
  bn: {
    searchPlaceholder: "যেকোনো ভাষায় খুঁজুন...",
    search: "খুঁজুন",
    resultsFor: "ফলাফল",
    fromYourCountry: "আপনার দেশ থেকে",
    fromOtherCountries: "অন্যান্য দেশ থেকে",
    noResults: "কোন পণ্য পাওয়া যায়নি। অন্য কীওয়ার্ড চেষ্টা করুন।",
  },
  ur: {
    searchPlaceholder: "کسی بھی زبان میں تلاش کریں...",
    search: "تلاش",
    resultsFor: "نتائج",
    fromYourCountry: "آپ کے ملک سے",
    fromOtherCountries: "دوسرے ممالک سے",
    noResults: "کوئی مصنوعات نہیں ملیں۔ مختلف مطلوبہ الفاظ آزمائیں۔",
  },
  hi: {
    searchPlaceholder: "किसी भी भाषा में खोजें...",
    search: "खोज",
    resultsFor: "परिणाम",
    fromYourCountry: "आपके देश से",
    fromOtherCountries: "अन्य देशों से",
    noResults: "कोई उत्पाद नहीं मिला। अलग कीवर्ड आजमाएं।",
  },
  ne: {
    searchPlaceholder: "कुनै भाषामा खोज्नुहोस्...",
    search: "खोज्नुहोस्",
    resultsFor: "नतिजाहरू",
    fromYourCountry: "तपाईंको देशबाट",
    fromOtherCountries: "अन्य देशहरूबाट",
    noResults: "कुनै उत्पादन भेटिएन। फरक कीवर्ड प्रयास गर्नुहोस्।",
  },
  si: {
    searchPlaceholder: "ඕනෑම භාෂාවකින් සොයන්න...",
    search: "සොයන්න",
    resultsFor: "ප්‍රතිඵල",
    fromYourCountry: "ඔබේ රටෙන්",
    fromOtherCountries: "වෙනත් රටවලින්",
    noResults: "නිෂ්පාදන හමු නොවීය. වෙනත් මූල පද උත්සාහ කරන්න.",
  },
  vi: {
    searchPlaceholder: "Tìm kiếm bằng mọi ngôn ngữ...",
    search: "Tìm kiếm",
    resultsFor: "Kết quả cho",
    fromYourCountry: "Từ đất nước bạn",
    fromOtherCountries: "Từ các nước khác",
    noResults: "Không tìm thấy sản phẩm. Thử từ khóa khác.",
  },
  ja: {
    searchPlaceholder: "あらゆる言語で検索...",
    search: "検索",
    resultsFor: "の検索結果",
    fromYourCountry: "お客様の国から",
    fromOtherCountries: "他の国から",
    noResults: "商品が見つかりません。別のキーワードをお試しください。",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = storage.get("user_language") as Language;
    if (saved && translations[saved]) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.set("user_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
