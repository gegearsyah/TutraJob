/**
 * Supabase Storage Utilities
 * For handling file uploads (CV, resumes, etc.)
 */

import { supabase } from './client';

const BUCKET_NAME = 'user-documents';

/**
 * Upload CV/Resume file
 * @param file - File to upload
 * @param userId - User ID
 * @returns Public URL of uploaded file
 */
export async function uploadCV(
  file: File,
  userId: string
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `cv/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload CV: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Delete CV file
 * @param filePath - Path to file in storage
 */
export async function deleteCV(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete CV: ${error.message}`);
  }
}

/**
 * Get public URL for a file
 * @param filePath - Path to file in storage
 * @returns Public URL
 */
export function getFileUrl(filePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return publicUrl;
}
