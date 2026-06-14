import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createProductSchema, updateProductSchema } from './products.schema';
import type { CreateProductInput, UpdateProductInput } from './products.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('bestSeller') bestSeller?: string,
    @Query('newArrival') newArrival?: string,
  ) {
    const filters = {
      categorySlug,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bestSeller: bestSeller === 'true' ? true : bestSeller === 'false' ? false : undefined,
      newArrival: newArrival === 'true' ? true : newArrival === 'false' ? false : undefined,
    };
    const products = await this.productsService.findAllProducts(filters);
    return { success: true, count: products.length, data: products };
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.findProductById(id);
    return { success: true, data: product };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createProduct(@Body(new ZodValidationPipe(createProductSchema)) createProductDto: CreateProductInput) {
    const product = await this.productsService.createProduct(createProductDto);
    return { success: true, message: 'Product created successfully', data: product };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) updateProductDto: UpdateProductInput,
  ) {
    const product = await this.productsService.updateProduct(id, updateProductDto);
    return { success: true, message: 'Product updated successfully', data: product };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return { success: true, message: 'Product deleted successfully' };
  }
}
