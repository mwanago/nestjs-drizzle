import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { isDatabaseError } from '../database/databse-error';
import { PostgresErrorCode } from '../database/postgres-error-code.enum';

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
    const article = await this.drizzleService.db.query.articles.findFirst({
      with: {
        author: {
          with: {
            address: true,
          },
        },
      },
      where: eq(databaseSchema.articles.id, articleId),
    });

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  async create(article: CreateArticleDto, authorId: number) {
    try {
      const createdArticles = await this.drizzleService.db
        .insert(databaseSchema.articles)
        .values({
          authorId,
          title: article.title,
          content: article.content,
        })
        .returning();

      return createdArticles.pop();
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.NotNullViolation
      ) {
        throw new BadRequestException(
          `The value of ${error.column} can not be null`,
        );
      }
      throw error;
    }
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
