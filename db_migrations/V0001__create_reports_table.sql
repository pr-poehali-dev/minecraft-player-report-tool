CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  author_nick VARCHAR(64) NOT NULL,
  target_nick VARCHAR(64) NOT NULL,
  violation_type VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
