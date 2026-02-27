import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(code: string) {
    return this.prisma.country.findUnique({
      where: { code },
    });
  }

  async getHomepageData(code: string) {
    const country = await this.prisma.country.findUnique({
      where: { code },
      include: {
        vendors: {
          where: { isActive: true, status: 'APPROVED' },
          take: 6,
        },
        products: {
          where: { status: 'ACTIVE', featured: true },
          take: 8,
          include: { vendor: true },
        },
        banners: {
          where: { 
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
      },
    });

    return country;
  }
}
