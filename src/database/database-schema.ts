import {
  serial,
  text,
  integer,
  pgTable,
  primaryKey,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  addressId: integer('address_id')
    .unique()
    .references(() => addresses.id),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  properties: json('properties').notNull(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  paragraphs: text('paragraphs').array().notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
  scheduledDate: timestamp('scheduled_date', {
    withTimezone: true,
  }),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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

export const usersAddressesRelation = relations(users, ({ one }) => ({
  address: one(addresses, {
    fields: [users.addressId],
    references: [addresses.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  categoriesArticles: many(categoriesArticles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  categoriesArticles: many(categoriesArticles),
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
  addresses,
  users,
  usersAddressesRelation,
  articlesRelations,
  categories,
  categoriesArticles,
  categoriesArticlesRelations,
  categoriesRelations,
  products,
};
