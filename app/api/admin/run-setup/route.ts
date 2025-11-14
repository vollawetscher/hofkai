import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Read the complete setup SQL
    const setupSQL = `
-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  baukloetze INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON user_profiles;
CREATE POLICY "Users can view own profile or admins can view all" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON user_profiles;
CREATE POLICY "Users can update own profile or admins can update all" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
    `

    console.log('[v0] Starting database setup...')
    
    // Execute the SQL in smaller chunks to avoid timeouts
    const { error } = await supabase.rpc('exec_sql', { query: setupSQL })
    
    if (error) {
      console.error('[v0] Setup SQL error:', error)
      return NextResponse.json({ 
        error: 'Setup fehlgeschlagen',
        details: error.message 
      }, { status: 500 })
    }

    console.log('[v0] Database setup completed successfully')
    
    // Redirect to admin page with success message
    return NextResponse.redirect(new URL('/admin/setup?success=true', process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'))
    
  } catch (error: any) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json({ 
      error: 'Setup fehlgeschlagen',
      details: error.message 
    }, { status: 500 })
  }
}
