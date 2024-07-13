import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.products);
  }

  async getById(productId: number) {
    const product = await this.drizzleService.db.query.products.findFirst({
      where: eq(databaseSchema.products.id, productId),
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async create(data: ProductDto) {
    const createdProducts = await this.drizzleService.db
      .insert(databaseSchema.products)
      .values({
        name: data.name,
        properties: data.properties,
      })
      .returning();

    return createdProducts.pop();
  }

  async update(id: number, data: ProductDto) {
    const updatedProducts = await this.drizzleService.db
      .update(databaseSchema.products)
      .set(data)
      .where(eq(databaseSchema.products.id, id))
      .returning();

    if (updatedProducts.length === 0) {
      throw new NotFoundException();
    }

    return updatedProducts.pop();
  }

  async delete(id: number) {
    const deletedProducts = await this.drizzleService.db
      .delete(databaseSchema.products)
      .where(eq(databaseSchema.products.id, id))
      .returning();

    if (deletedProducts.length === 0) {
      throw new NotFoundException();
    }
  }
}
