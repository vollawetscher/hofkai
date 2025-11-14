-- Add admin role to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set hofkai@googlemail.com as admin
UPDATE user_profiles
SET is_admin = true
WHERE email = 'hofkai@googlemail.com';

-- Create admin policies for viewing all data
CREATE POLICY "Admins can view all profiles" ON user_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can view all token usage" ON token_usage
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can view all posts" ON community_posts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can view all comments" ON community_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can view all consultation requests" ON consultation_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create admin dashboard table for statistics
CREATE TABLE IF NOT EXISTS admin_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  total_users INT DEFAULT 0,
  total_posts INT DEFAULT 0,
  total_tokens_used INT DEFAULT 0
);

-- Enable RLS
ALTER TABLE admin_stats ENABLE ROW LEVEL SECURITY;

-- Only admins can view stats
CREATE POLICY "Admins can view stats" ON admin_stats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true
  )
);
