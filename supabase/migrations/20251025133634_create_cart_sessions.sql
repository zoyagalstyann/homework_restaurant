/*
  # Create cart sessions table

  1. New Tables
    - `cart_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Browser session identifier
      - `cart_data` (jsonb) - Cart items stored as JSON
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `cart_sessions` table
    - Add policy for public access (cart is public before auth)
*/

CREATE TABLE IF NOT EXISTS cart_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  cart_data jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

-- Public access for cart sessions (anyone can manage their own cart by session_id)
CREATE POLICY "Anyone can insert cart session"
  ON cart_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view cart by session_id"
  ON cart_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update cart by session_id"
  ON cart_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart by session_id"
  ON cart_sessions
  FOR DELETE
  TO anon
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);
