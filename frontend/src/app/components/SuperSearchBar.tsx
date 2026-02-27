"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { detectInputLanguage, buildSearchQuery } from "@/lib/search";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";

interface SuperSearchBarProps {
  userCountryCode: string;
  variant?: "header" | "hero";
}

export default function SuperSearchBar({ userCountryCode, variant = "header" }: SuperSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t, language } = useLanguage();
  const router = useRouter();

  const detectLanguage = useCallback((text: string) => {
    const lang = detectInputLanguage(text);
    const langNames: Record<string, string> = {
      en: "English", bn: "বাংলা", ur: "اردو", hi: "हिंदी",
      ne: "नेपाली", si: "සිංහල", vi: "Tiếng Việt", ja: "日本語",
    };
    return langNames[lang] || "English";
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(query)}&country=${userCountryCode}&lang=${language}`);
    setIsLoading(false);
    setShowSuggestions(false);
  };

  const fetchSuggestions = useCallback(async (text: string) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    const response = await apiClient.get(`/products/suggest?q=${encodeURIComponent(text)}`);
    if (response.success) {
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const isHero = variant === "hero";

  return (
    <div className={cn("relative", isHero ? "w-full max-w-2xl" : "w-full max-w-xl")}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={t("searchPlaceholder")}
          className={cn(
            "w-full pl-12 pr-20 rounded-full border-2 focus:outline-none transition-all",
            isHero
              ? "py-4 text-lg border-white/30 bg-white/90 backdrop-blur focus:border-blue-500"
              : "py-2.5 border-gray-300 focus:border-blue-500"
          )}
          dir="auto"
        />
        <Search
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
            isHero ? "w-6 h-6" : "w-5 h-5"
          )}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {query && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {detectLanguage(query)}
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "px-4 rounded-full font-medium transition-colors",
              isHero
                ? "py-2 bg-blue-600 text-white hover:bg-blue-700"
                : "py-1.5 bg-gray-900 text-white hover:bg-gray-800"
            )}
          >
            {isLoading ? "..." : t("search")}
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(suggestion.name);
                handleSearch();
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{suggestion.name}</span>
              <span className="text-sm text-gray-500">{suggestion.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
