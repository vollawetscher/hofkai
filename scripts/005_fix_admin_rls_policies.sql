-- Drop problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all token usage" ON token_usage;
DROP POLICY IF EXISTS "Admins can view all posts" ON community_posts;
DROP POLICY IF EXISTS "Admins can view all comments" ON community_comments;
DROP POLICY IF EXISTS "Admins can view all consultation requests" ON consultation_requests;
DROP POLICY IF EXISTS "Admins can view stats" ON admin_stats;

-- Create a function to check if current user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies using OR logic to combine with existing policies
-- This allows both regular users AND admins to access their data

-- User profiles: users see their own OR admins see all
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users and admins can view profiles" ON user_profiles
FOR SELECT
USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users and admins can update profiles" ON user_profiles
FOR UPDATE
USING (auth.uid() = id OR is_admin());

-- Token usage: users see their own OR admins see all
DROP POLICY IF EXISTS "Users can view their own token usage" ON token_usage;
CREATE POLICY "Users and admins can view token usage" ON token_usage
FOR SELECT
USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can insert their own token usage" ON token_usage;
CREATE POLICY "Users and admins can insert token usage" ON token_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id OR is_admin());

-- Community posts: public OR admins see all
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
CREATE POLICY "Public and admins can view posts" ON community_posts
FOR SELECT
USING (true); -- Posts are public, admins just get same access

-- Community comments: public OR admins see all
DROP POLICY IF EXISTS "Anyone can view comments" ON community_comments;
CREATE POLICY "Public and admins can view comments" ON community_comments
FOR SELECT
USING (true); -- Comments are public

-- Consultation requests: users see their own OR admins see all
CREATE POLICY "Users and admins can view consultation requests" ON consultation_requests
FOR SELECT
USING (auth.uid() = user_id OR is_admin());

-- Admin stats: only admins
CREATE POLICY "Only admins can view stats" ON admin_stats
FOR SELECT
USING (is_admin());
