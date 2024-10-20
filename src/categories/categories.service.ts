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

  async getById(categoryId: number) {
    const category = await this.drizzleService.db.query.categories.findFirst({
      with: {
        categoriesArticles: {
          with: {
            article: true,
          },
        },
        parentCategory: true,
        nestedCategories: true,
      },
      where: eq(databaseSchema.categories.id, categoryId),
    });

    if (!category) {
      throw new NotFoundException();
    }

    const articles = category.categoriesArticles.map(({ article }) => article);

    return {
      id: category.id,
      name: category.name,
      parentCategory: category.parentCategory,
      nestedCategories: category.nestedCategories,
      articles,
    };
  }

  async create(data: CategoryDto) {
    const createdCategories = await this.drizzleService.db
      .insert(databaseSchema.categories)
      .values({
        name: data.name,
        parentCategoryId: data.parentCategoryId,
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
