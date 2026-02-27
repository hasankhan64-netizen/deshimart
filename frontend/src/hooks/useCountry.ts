import { useParams } from "next/navigation";

export type CountryCode = "BD" | "PK" | "IN" | "NP" | "LK" | "VN" | "JP";

interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  languageName: string;
}

const countries: Record<CountryCode, CountryInfo> = {
  BD: { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", languageName: "বাংলা" },
  PK: { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR", languageName: "اردو" },
  IN: { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", languageName: "हिंदी" },
  NP: { code: "NP", name: "Nepal", flag: "🇳🇵", currency: "NPR", languageName: "नेपाली" },
  LK: { code: "LK", name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", languageName: "සිංහල" },
  VN: { code: "VN", name: "Vietnam", flag: "🇻🇳", currency: "VND", languageName: "Tiếng Việt" },
  JP: { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", languageName: "日本語" },
};

export function useCountry() {
  const params = useParams();
  const code = ((params?.country as string) || "BD").toUpperCase() as CountryCode;
  const country = countries[code] || countries.BD;

  return { country, countryCode: country.code, countries };
}
