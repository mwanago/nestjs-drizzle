import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.categories);
  }

  async getById(id: number) {
    const categories = await this.drizzleService.db
      .select()
      .from(databaseSchema.categories)
      .where(eq(databaseSchema.categories.id, id));
    const category = categories.pop();
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async create(data: CategoryDto) {
    const createdCategories = await this.drizzleService.db
      .insert(databaseSchema.categories)
      .values({
        name: data.name,
      })
      .returning();

    return createdCategories.pop();
  }

  async update(id: number, data: CategoryDto) {
    const updatedCategories = await this.drizzleService.db
      .update(databaseSchema.categories)
      .set(data)
      .where(eq(databaseSchema.categories.id, id))
      .returning();

    if (updatedCategories.length === 0) {
      throw new NotFoundException();
    }

    return updatedCategories.pop();
  }

  async delete(id: number) {
    const deletedCategories = await this.drizzleService.db
      .delete(databaseSchema.categories)
      .where(eq(databaseSchema.categories.id, id))
      .returning();

    if (deletedCategories.length === 0) {
      throw new NotFoundException();
    }
  }
}
