import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const data = await this.productsService.findAll(search);
    return { success: true, data };
  }

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold?: string) {
    const data = await this.productsService.getLowStock(
      threshold ? parseInt(threshold) : 20,
    );
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return { success: true, data };
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      slug?: string;
      description?: string;
      shortDescription?: string;
      price: number;
      unit?: string;
      stock?: number;
      categoryId: string;
      featured?: boolean;
      bestseller?: boolean;
    },
  ) {
    const data = await this.productsService.create(body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      slug: string;
      description: string;
      shortDescription: string;
      price: number;
      unit: string;
      stock: number;
      categoryId: string;
      featured: boolean;
      bestseller: boolean;
    }>,
  ) {
    const data = await this.productsService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { success: true, data: null };
  }
}
