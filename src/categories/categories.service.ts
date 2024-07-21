import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq, sql, and, isNull } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll() {
    return this.drizzleService.db
      .select()
      .from(databaseSchema.categories)
      .where(isNull(databaseSchema.categories.deletedAt));
  }

  async getById(categoryId: number) {
    const category = await this.drizzleService.db.query.categories.findFirst({
      with: {
        categoriesArticles: {
          with: {
            article: true,
          },
        },
      },
      where: and(
        eq(databaseSchema.categories.id, categoryId),
        isNull(databaseSchema.categories.deletedAt),
      ),
    });

    if (!category) {
      throw new NotFoundException();
    }

    const articles = category.categoriesArticles.map(({ article }) => article);

    return {
      id: category.id,
      name: category.name,
      articles,
    };
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
      .where(
        and(
          eq(databaseSchema.categories.id, id),
          isNull(databaseSchema.categories.deletedAt),
        ),
      )
      .returning();

    if (updatedCategories.length === 0) {
      throw new NotFoundException();
    }

    return updatedCategories.pop();
  }

  async delete(id: number) {
    const deletedCategories = await this.drizzleService.db
      .update(databaseSchema.categories)
      .set({
        deletedAt: sql`now()`,
      })
      .where(
        and(
          eq(databaseSchema.categories.id, id),
          isNull(databaseSchema.categories.deletedAt),
        ),
      )
      .returning();

    if (deletedCategories.length === 0) {
      throw new NotFoundException();
    }
  }
}
