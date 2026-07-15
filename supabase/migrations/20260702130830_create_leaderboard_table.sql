/*
# Create leaderboard table for Strategic Memory Game

1. New Tables
- `leaderboard`
- `id` (uuid, primary key)
- `player_name` (text, not null) - name entered by player
- `score` (integer, not null) - final score
- `time_seconds` (integer, not null) - time taken to complete
- `moves` (integer, not null) - number of moves taken
- `difficulty` (text, not null) - game difficulty level
- `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `leaderboard`.
- Allow anon + authenticated to read all entries (public leaderboard).
- Allow anon + authenticated to insert new scores.
- No update or delete from the frontend.

3. Notes
- Single-tenant app: no authentication required, players just enter their name.
- Leaderboard is intentionally public/shared.
- Index on score desc for efficient ranking queries.
*/

create table leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  email text,
  score integer not null,
  time_seconds integer not null,
  moves integer not null,
  difficulty text not null,
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS leaderboard_score_desc_idx ON leaderboard(score DESC);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_leaderboard" ON leaderboard;
CREATE POLICY "public_read_leaderboard" ON leaderboard FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_leaderboard" ON leaderboard;
CREATE POLICY "public_insert_leaderboard" ON leaderboard FOR INSERT
  TO anon, authenticated WITH CHECK (true);