import { serial, text, integer, pgTable } from 'drizzle-orm/pg-core';
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

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
});

export const usersAddressesRelation = relations(users, ({ one }) => ({
  address: one(addresses, {
    fields: [users.addressId],
    references: [addresses.id],
  }),
}));

export const articlesAuthorsRelation = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export const databaseSchema = {
  articles,
  addresses,
  users,
  usersAddressesRelation,
  articlesAuthorsRelation,
};
