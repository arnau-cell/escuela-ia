-- Migración D1 inicial del ranking (RANKING-WIKI R1): agregados por herramienta, sin ningún
-- dato personal. `votes` lo escribe POST /api/wiki/vote, `nucleo_recs` lo escribe chat.ts al
-- cerrar un plan (R2), `editorial_score` queda en 0 hasta R3 (puntuación editorial).
CREATE TABLE IF NOT EXISTS tool_stats (
	tool_id TEXT PRIMARY KEY,
	votes INTEGER NOT NULL DEFAULT 0,
	nucleo_recs INTEGER NOT NULL DEFAULT 0,
	editorial_score REAL NOT NULL DEFAULT 0,
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
