# Supabase Setup Guide

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

## Database Setup

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the schema from `supabase/schema.sql`
4. This will create all necessary tables, indexes, and RLS policies

## Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `user-documents`
3. Set bucket to **Public** (or configure RLS policies for private access)
4. Configure allowed file types: `pdf`, `doc`, `docx`
5. Set max file size: 5MB

### Storage Policies (if using private bucket)

```sql
-- Allow users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Authentication Setup

1. Go to Authentication > Providers in Supabase dashboard
2. Enable Email provider (or other providers as needed)
3. Configure email templates if needed

## Testing

After setup, test the connection:

```typescript
import { supabase } from '@/lib/supabase/client';

// Test connection
const { data, error } = await supabase.from('user_profiles').select('count');
console.log('Connection test:', { data, error });
```

## Next Steps

1. Set up authentication flow
2. Test file uploads
3. Test database queries
4. Set up monitoring and backups
