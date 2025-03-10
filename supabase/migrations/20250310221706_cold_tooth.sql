/*
  # Create forum tables

  1. New Tables
    - `forum_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `user_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `likes` (integer)
      - `views` (integer)
      - `tags` (text[])
    - `forum_replies`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references forum_posts)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `likes` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read all posts and replies
      - Create posts and replies
      - Update/delete their own posts and replies
*/

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[]
);

-- Create forum_replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Policies for forum_posts
CREATE POLICY "Anyone can read posts"
  ON forum_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for forum_replies
CREATE POLICY "Anyone can read replies"
  ON forum_replies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON forum_replies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON forum_replies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();