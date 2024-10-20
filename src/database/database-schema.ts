import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  parentCategoryId: integer('parent_category_id').references(
    (): AnyPgColumn => categories.id,
  ),
});

export const categoriesArticles = pgTable(
  'categories_articles',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
  },
  (columns) => ({
    pk: primaryKey({ columns: [columns.categoryId, columns.articleId] }),
  }),
);

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  categoriesArticles: many(categoriesArticles),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  categoriesArticles: many(categoriesArticles),
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
  }),
}));

export const categoriesArticlesRelations = relations(
  categoriesArticles,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoriesArticles.categoryId],
      references: [categories.id],
    }),
    article: one(articles, {
      fields: [categoriesArticles.articleId],
      references: [articles.id],
    }),
  }),
);

export const databaseSchema = {
  articles,
  users,
  articlesRelations,
  categories,
  categoriesArticles,
  categoriesArticlesRelations,
  categoriesRelations,
};
