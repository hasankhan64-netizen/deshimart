import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // GET /products/suggest?q=...
  // ──────────────────────────────────────────────
  async findSuggestions(query: string) {
    if (!query || query.length < 2) return [];

    const products = await this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: query } },
          { nameNative: { contains: query } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        nameNative: true,
        slug: true,
        categoryId: true,
        category: { select: { name: true } },
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      nameNative: p.nameNative,
      slug: p.slug,
      category: p.category?.name ?? null,
    }));
  }

  // ──────────────────────────────────────────────
  // GET /products/search?q=...&country=BD&lang=en
  // ──────────────────────────────────────────────
  async search(query: string, userCountry: string, language?: string) {
    if (!query) return [];

    const q = query.trim();

    // MySQL collation is case-insensitive by default, no need for mode
    const products = await this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: q } },
          { nameNative: { contains: q } },
          { description: { contains: q } },
          { descriptionNative: { contains: q } },
          { slug: { contains: q } },
          { tags: { string_contains: q } },
        ],
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessNameNative: true,
            countryId: true,
          },
        },
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
        },
        category: {
          select: { id: true, name: true, nameNative: true },
        },
      },
      take: 60,
    });

    // Score & rank — user's country gets a big boost
    const scored = products.map((p) => ({
      ...p,
      relevanceScore: this.calculateRelevance(p, q, userCountry),
    }));

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scored;
  }

  // ──────────────────────────────────────────────
  // Relevance scorer
  // ──────────────────────────────────────────────
  private calculateRelevance(
    product: any,
    query: string,
    userCountry: string,
  ): number {
    let score = 0;
    const q = query.toLowerCase();

    // — Name matches —
    const name = (product.name ?? '').toLowerCase();
    const nameNative = (product.nameNative ?? '').toLowerCase();

    if (name === q || nameNative === q) score += 10;
    else if (name.startsWith(q) || nameNative.startsWith(q)) score += 7;
    else if (name.includes(q) || nameNative.includes(q)) score += 5;

    // — Description matches —
    const desc = (product.description ?? '').toLowerCase();
    const descNative = (product.descriptionNative ?? '').toLowerCase();
    if (desc.includes(q) || descNative.includes(q)) score += 2;

    // — Tag match —
    const tags: string[] = Array.isArray(product.tags) ? product.tags : [];
    if (tags.some((t: string) => t.toLowerCase().includes(q))) score += 3;

    // — Country boost (biggest factor) —
    const targetCountries: string[] = Array.isArray(product.targetCountries)
      ? product.targetCountries
      : [];

    if (
      product.countryId === userCountry ||
      targetCountries.includes(userCountry)
    ) {
      score += 20;
    }

    // — Popularity tiebreaker —
    score += Math.min((product.salesCount ?? 0) / 100, 2);

    return score;
  }
}
