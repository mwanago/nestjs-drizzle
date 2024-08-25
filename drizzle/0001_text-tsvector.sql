ALTER TABLE "articles" ADD COLUMN "text_tsvector" "tsvector" GENERATED ALWAYS AS (
      setweight(to_tsvector('english', "articles"."title"), 'A') ||
      setweight(to_tsvector('english', "articles"."content"), 'B')
    ) STORED;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "text_tsvector_index" ON "articles" USING gin ("text_tsvector");