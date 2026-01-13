/**
 * User Profile Page
 * Page for users to create/edit their profile with CV upload
 */

'use client';

import { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/job-seeker/ProfileForm';
import type { ProfileFormData } from '@/lib/validations/profile';
import { supabase } from '@/lib/supabase/client';
import { announce } from '@/lib/audio';

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSubmit = async (data: ProfileFormData) => {
    if (!userId) {
      announce('Anda harus login terlebih dahulu');
      return;
    }

    try {
      // TODO: Save profile to Supabase
      // This will be implemented with database schema
      console.log('Profile data:', data);
      announce('Profil berhasil disimpan');
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Anda harus login untuk mengakses halaman ini
          </p>
          {/* TODO: Add login link/button */}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
          <p className="text-muted-foreground">
            Lengkapi profil Anda untuk meningkatkan peluang mendapatkan pekerjaan
          </p>
        </header>

        <ProfileForm userId={userId} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
