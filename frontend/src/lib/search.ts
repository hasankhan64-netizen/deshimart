// Detect script/language of input text
export function detectInputLanguage(text: string): string {
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0600-\u06FF]/.test(text)) return "ur";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0D80-\u0DFF]/.test(text)) return "si";
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) return "vi";
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return "ja";
  return "en";
}

// Normalize text for search (remove accents, lowercase)
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0980-\u09FF\u0600-\u06FF\u0900-\u097F\u0D80-\u0DFF]/g, " ")
    .trim();
}

// Build search query for API
export function buildSearchQuery(
  query: string,
  userCountryCode: string,
  userLanguage: string
) {
  const detectedLang = detectInputLanguage(query);

  return {
    q: normalizeText(query),
    originalQuery: query,
    inputLanguage: detectedLang,
    userCountry: userCountryCode,
    userLanguage: userLanguage,
    searchFields: ["name", "nameNative", "tags", "description", "keywords"],
  };
}

// Rank results: country products first, then by relevance
export function rankSearchResults(
  products: any[],
  userCountryCode: string
): any[] {
  return products.sort((a, b) => {
    const aIsUserCountry =
      a.countryId === userCountryCode ||
      a.targetCountries?.includes(userCountryCode);
    const bIsUserCountry =
      b.countryId === userCountryCode ||
      b.targetCountries?.includes(userCountryCode);

    if (aIsUserCountry && !bIsUserCountry) return -1;
    if (!aIsUserCountry && bIsUserCountry) return 1;

    return (b.relevanceScore || 0) - (a.relevanceScore || 0);
  });
}
