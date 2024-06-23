CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_articles" (
	"category_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	CONSTRAINT "categories_articles_category_id_article_id_pk" PRIMARY KEY("category_id","article_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_articles" ADD CONSTRAINT "categories_articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_articles" ADD CONSTRAINT "categories_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;