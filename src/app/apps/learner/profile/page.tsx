/**
 * User Profile Page
 * Page for users to create/edit their profile with CV upload
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfileForm } from '@/components/job-seeker/ProfileForm';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/hooks/useTutorial';
import { learnerTutorialSteps } from '@/lib/tutorials/learner-tutorial';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import type { ProfileFormData } from '@/lib/validations/profile';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';

export default function ProfilePage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Profil Saya', 'Kelola profil dan informasi pribadi Anda');

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useIsMounted();
  const { isOpen, startTutorial, closeTutorial, completeTutorial } = useTutorial('learner-profile');

  useEffect(() => {
    // Get current user (client-side only)
    if (!isMounted) return;

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [isMounted]);

  const handleSubmit = async (data: ProfileFormData) => {
    if (!userId) {
      if (isMounted) {
        announce('Anda harus login terlebih dahulu');
      }
      return;
    }

    try {
      // TODO: Save profile to Supabase
      // This will be implemented with database schema
      console.log('Profile data:', data);
      if (isMounted) {
        announce('Profil berhasil disimpan');
      }
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
        <div className="text-center space-y-4">
          <p className="text-muted-foreground mb-4">
            Anda harus login untuk mengakses halaman ini
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apps/learner/auth/login"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/apps/learner/auth/signup"
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
            <p className="text-muted-foreground">
              Lengkapi profil Anda untuk meningkatkan peluang mendapatkan pekerjaan
            </p>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="learner-profile"
            label="Tutorial"
          />
        </header>

        <ProfileForm userId={userId} onSubmit={handleSubmit} />
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={learnerTutorialSteps.filter((step) => 
          ['profile-setup', 'complete'].includes(step.id)
        )}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="learner-profile"
        title="Tutorial Profil"
      />
    </div>
  );
}
