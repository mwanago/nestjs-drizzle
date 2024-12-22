import { serial, text, integer, pgTable } from 'drizzle-orm/pg-core';

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

export const databaseSchema = {
  articles,
  users,
};
