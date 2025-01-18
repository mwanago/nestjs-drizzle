CREATE TABLE IF NOT EXISTS "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"polygon" geometry(polygon, 4326) NOT NULL
);
