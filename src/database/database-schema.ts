import { serial, text, pgTable, customType, index } from 'drizzle-orm/pg-core';
import { sql, SQL } from 'drizzle-orm';

const tsvector = customType<{ data: unknown }>({
  dataType() {
    return 'tsvector';
  },
});

export const articles = pgTable(
  'articles',
  {
    id: serial('id').primaryKey(),
    title: text('title'),
    content: text('content'),
    textTsvector: tsvector('text_tsvector').generatedAlwaysAs(
      (): SQL => sql`
      setweight(to_tsvector('english', ${articles.title}), 'A') ||
      setweight(to_tsvector('english', ${articles.content}), 'B')
    `,
    ),
  },
  (table) => {
    return {
      textTsvectorIndex: index('text_tsvector_index').using(
        'gin',
        table.textTsvector,
      ),
    };
  },
);

export const databaseSchema = {
  articles,
};
