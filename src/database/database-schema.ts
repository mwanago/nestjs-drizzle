import { serial, text, pgTable, geometry } from 'drizzle-orm/pg-core';

export const locations = pgTable('locations', {
  id: serial().primaryKey(),
  name: text().notNull(),
  coordinates: geometry('coordinates', { type: 'point', mode: 'xy' }).notNull(),
});

export const databaseSchema = {
  locations,
};
