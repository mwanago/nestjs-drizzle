CREATE MATERIALIZED VIEW articles_scheduled_for_today AS
  SELECT * FROM articles
  WHERE DATE(scheduled_date) = CURRENT_DATE;