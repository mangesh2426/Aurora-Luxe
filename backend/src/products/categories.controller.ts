import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createCategorySchema } from './products.schema';
import type { CreateCategoryInput } from './products.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllCategories() {
    const categories = await this.productsService.findAllCategories();
    return { success: true, count: categories.length, data: categories };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategory(@Body(new ZodValidationPipe(createCategorySchema)) createCategoryDto: CreateCategoryInput) {
    const category = await this.productsService.createCategory(createCategoryDto);
    return { success: true, message: 'Category created successfully', data: category };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCategory(@Param('id') id: string) {
    await this.productsService.deleteCategory(id);
    return { success: true, message: 'Category deleted successfully' };
  }
}
