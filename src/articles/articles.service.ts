import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { asc, count, eq, gt } from 'drizzle-orm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { isDatabaseError } from '../database/databse-error';
import { PostgresErrorCode } from '../database/postgres-error-code.enum';
import { PaginationParamsDto } from '../utilities/pagination-params.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  getAll({ offset, limit, idsToSkip }: PaginationParamsDto) {
    return this.drizzleService.db.transaction(async (transaction) => {
      const articlesCountResponses = await transaction
        .select({ articlesCount: count() })
        .from(databaseSchema.articles);

      const { articlesCount } = articlesCountResponses[0];

      const dataQuery = transaction
        .select()
        .from(databaseSchema.articles)
        .orderBy(asc(databaseSchema.articles.id))
        .offset(offset)
        .where(gt(databaseSchema.articles.id, idsToSkip));

      if (limit) {
        const data = await dataQuery.limit(limit);
        return {
          data,
          count: articlesCount,
        };
      }

      const data = await dataQuery;

      return {
        data,
        count: articlesCount,
      };
    });
  }

  async getById(articleId: number) {
    const article = await this.drizzleService.db.query.articles.findFirst({
      with: {
        author: {
          with: {
            address: true,
          },
        },
        categoriesArticles: {
          with: {
            category: true,
          },
        },
      },
      where: eq(databaseSchema.articles.id, articleId),
    });

    if (!article) {
      throw new NotFoundException();
    }

    const categories = article.categoriesArticles.map(
      ({ category }) => category,
    );

    return {
      id: article.id,
      author: article.author,
      title: article.title,
      content: article.content,
      categories,
    };
  }

  async create(article: CreateArticleDto, authorId: number) {
    if (article.categoryIds?.length) {
      return this.createWithCategories(article, authorId);
    }
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
      if (!isDatabaseError(error)) {
        throw error;
      }
      if (error.code === PostgresErrorCode.NotNullViolation) {
        throw new BadRequestException(
          `The value of ${error.column} can not be null`,
        );
      }
      if (error.code === PostgresErrorCode.CheckViolation) {
        throw new BadRequestException('The title can not be an empty string');
      }
      throw error;
    }
  }

  async createWithCategories(article: CreateArticleDto, authorId: number) {
    return this.drizzleService.db.transaction(async (transaction) => {
      const createdArticles = await transaction
        .insert(databaseSchema.articles)
        .values({
          authorId,
          title: article.title,
          content: article.content,
        })
        .returning();

      const createdArticle = createdArticles[0];

      await transaction.insert(databaseSchema.categoriesArticles).values(
        article.categoryIds.map((categoryId) => ({
          categoryId,
          articleId: createdArticle.id,
        })),
      );

      return {
        ...createdArticle,
        categoryIds: article.categoryIds,
      };
    });
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
