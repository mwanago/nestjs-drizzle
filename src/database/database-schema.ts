import { serial, text, pgTable, interval } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),
});

export const food = pgTable('food', {
  id: serial('id').primaryKey(),
  name: text('name'),
  expiryAfterOpening: interval('expiry_after_opening'),
});

export const databaseSchema = {
  articles,
  food,
};
