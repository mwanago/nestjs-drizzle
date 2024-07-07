ALTER TABLE articles
ADD COLUMN paragraphs TEXT[];

UPDATE articles
SET paragraphs = ARRAY[content];

ALTER TABLE articles
DROP COLUMN content;