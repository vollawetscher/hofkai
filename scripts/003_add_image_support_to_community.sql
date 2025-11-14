-- Add image support to community posts with proper rights management
alter table public.community_posts
add column if not exists image_url text,
add column if not exists image_rights_confirmed boolean default false,
add column if not exists image_uploaded_at timestamp with time zone;

-- Add comment to explain the rights confirmation
comment on column public.community_posts.image_rights_confirmed is 'User confirms they own rights to the uploaded image or have permission to use it';
