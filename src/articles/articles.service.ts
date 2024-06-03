import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.articles);
  }

  async getById(id: number) {
    const articles = await this.drizzleService.db
      .select()
      .from(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id));
    const article = articles.pop();
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async getWithAuthor(articleId: number) {
    const allResults = await this.drizzleService.db
      .select()
      .from(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, articleId))
      .innerJoin(
        databaseSchema.users,
        eq(databaseSchema.articles.authorId, databaseSchema.users.id),
      );

    const result = allResults.pop();

    if (!result) {
      throw new NotFoundException();
    }

    return {
      ...result.articles,
      author: result.users,
    };
  }

  async create(article: CreateArticleDto, authorId: number) {
    const createdArticles = await this.drizzleService.db
      .insert(databaseSchema.articles)
      .values({
        authorId,
        title: article.title,
        content: article.content,
      })
      .returning();

    return createdArticles.pop();
  }

  async update(id: number, article: UpdateArticleDto) {
    const updatedArticles = await this.drizzleService.db
      .update(databaseSchema.articles)
      .set(article)
      .where(eq(databaseSchema.articles.id, id))
      .returning();

    if (updatedArticles.length === 0) {
      throw new NotFoundException();
    }

    return updatedArticles.pop();
  }

  async delete(id: number) {
    const deletedArticles = await this.drizzleService.db
      .delete(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id))
      .returning();

    if (deletedArticles.length === 0) {
      throw new NotFoundException();
    }
  }
}
