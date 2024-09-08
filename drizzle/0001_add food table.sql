CREATE TABLE IF NOT EXISTS "food" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"expiry_after_opening" interval
);
