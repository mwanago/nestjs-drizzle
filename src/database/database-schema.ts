import { serial, text, integer, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: text().unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  password: text().notNull(),
});

export const articles = pgTable('articles', {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
});

export const articlesAuthorsRelation = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export const databaseSchema = {
  users,
  articles,
  articlesAuthorsRelation,
};
