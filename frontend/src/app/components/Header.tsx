"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Globe, Menu, X } from "lucide-react";
import { useCountry, CountryCode } from "@/hooks/useCountry";
import { useLanguage } from "@/context/LanguageContext";
import SuperSearchBar from "./SuperSearchBar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  countryCode: CountryCode;
}

export default function Header({ countryCode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { country } = useCountry();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "ne", name: "नेपाली", flag: "🇳🇵" },
    { code: "si", name: "සිංහල", flag: "🇱🇰" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href={`/${countryCode.toLowerCase()}`} className="flex items-center space-x-2 shrink-0">
            <span className="text-xl md:text-2xl font-bold text-blue-600">DeshiMart</span>
            <span className="text-xl md:text-2xl">{country?.flag}</span>
          </Link>

          {/* Super Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SuperSearchBar userCountryCode={countryCode} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-full"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium uppercase">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLangMenu(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3",
                        language === lang.code && "bg-blue-50 text-blue-600"
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span
                        className={lang.code === "ur" ? "font-arabic" : ""}
                        dir={lang.code === "ur" ? "rtl" : "ltr"}
                      >
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Account */}
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SuperSearchBar userCountryCode={countryCode} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4 bg-white">
          <div className="container mx-auto px-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href={`/${countryCode.toLowerCase()}`} className="py-2 hover:text-blue-600">Home</Link>
              <Link href="/categories" className="py-2 hover:text-blue-600">Categories</Link>
              <Link href="/vendors" className="py-2 hover:text-blue-600">Vendors</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
