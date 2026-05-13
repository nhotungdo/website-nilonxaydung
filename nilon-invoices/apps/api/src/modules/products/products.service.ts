import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { generateSlug } from '../../lib/slug';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, tags: true },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async create(data: {
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
  }) {
    const slug = data.slug || generateSlug(data.name);
    return this.prisma.product.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
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
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getLowStock(threshold = 20) {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        stock: { lte: threshold },
      },
      include: { category: true },
      orderBy: { stock: 'asc' },
    });
  }
}

