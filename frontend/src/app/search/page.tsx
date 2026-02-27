"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { apiClient } from "@/lib/api";
import { rankSearchResults } from "@/lib/search";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const countryCode = searchParams.get("country") || "BD";
  const { t } = useLanguage();
  const { country } = useCountry();

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      const response = await apiClient.get(
        `/products/search?q=${encodeURIComponent(query)}&country=${countryCode}`
      );

      if (response.success) {
        const ranked = rankSearchResults(response.data || [], countryCode);
        setResults(ranked);
      } else {
        setError(response.error || "Search failed");
      }
      setIsLoading(false);
    };

    fetchResults();
  }, [query, countryCode]);

  const countryResults = results.filter(
    (r) => r.countryId === countryCode || r.targetCountries?.includes(countryCode)
  );
  const otherResults = results.filter(
    (r) => r.countryId !== countryCode && !r.targetCountries?.includes(countryCode)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header countryCode={countryCode as any} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          {t("resultsFor")}: &ldquo;{query}&rdquo;
        </h1>
        <p className="text-gray-600 mb-6">
          Detected language: {country?.languageName || "English"}
        </p>

        {isLoading ? (
          <div className="text-center py-12">Searching...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t("noResults")}</div>
        ) : (
          <div className="space-y-8">
            {countryResults.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">{country?.flag}</span>
                  {t("fromYourCountry")} ({countryResults.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {countryResults.map((product) => (
                    <ProductCard key={product.id} product={product} priority />
                  ))}
                </div>
              </section>
            )}

            {otherResults.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-600">
                  {t("fromOtherCountries")} ({otherResults.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {otherResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
