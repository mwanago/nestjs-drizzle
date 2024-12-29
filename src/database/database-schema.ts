import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const databaseSchema = {
  articles,
};
