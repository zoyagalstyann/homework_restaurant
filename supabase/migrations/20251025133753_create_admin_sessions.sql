/*
  # Create admin sessions table

  1. New Tables
    - `admin_sessions`
      - `id` (uuid, primary key)
      - `session_token` (text, unique) - Browser session token
      - `is_logged_in` (boolean) - Login status
      - `created_at` (timestamptz)
      - `last_active` (timestamptz)
  
  2. Security
    - Enable RLS on `admin_sessions` table
    - Add policy for public access (admin login is handled separately)
*/

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  is_logged_in boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert admin session"
  ON admin_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view admin session"
  ON admin_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update admin session"
  ON admin_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete admin session"
  ON admin_sessions
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
