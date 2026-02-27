import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('suggest')
  async getSuggestions(@Query('q') query: string) {
    return this.productsService.findSuggestions(query);
  }

  @Get('search')
  async searchProducts(
    @Query('q') query: string,
    @Query('country') country: string,
    @Query('lang') language: string,
  ) {
    return this.productsService.search(query, country, language);
  }
}
