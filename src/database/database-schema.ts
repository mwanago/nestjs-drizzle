import { serial, text, integer, pgTable } from 'drizzle-orm/pg-core';
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

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export const databaseSchema = {
  articles,
  users,
  articlesRelations,
};
