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
import { VoiceSettings } from '@/components/settings/VoiceSettings';
import { useTutorial } from '@/hooks/useTutorial';
import { learnerProfileTutorialSteps } from '@/lib/tutorials/learner-profile-tutorial';
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
      // Save profile to Supabase
      const profileData = {
        id: userId,
        full_name: data.personalInfo.fullName,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        address_street: data.personalInfo.address.street,
        address_city: data.personalInfo.address.city,
        address_postal_code: data.personalInfo.address.postalCode,
        date_of_birth: data.personalInfo.dateOfBirth ? data.personalInfo.dateOfBirth.toISOString().split('T')[0] : null,
        national_id: data.personalInfo.nationalId || null,
        cover_letter: data.professionalInfo.coverLetter || null,
        cv_file_path: data.cvFilePath || null, // Set by ProfileForm after upload
        skills: data.professionalInfo.skills || [],
        certifications: data.professionalInfo.certifications?.map((c: any) => typeof c === 'string' ? c : c.name) || [],
        disability_type: data.accessibility.disabilityType || null,
        accommodations: data.accessibility.accommodations || [],
        assistive_tech: data.accessibility.assistiveTech || [],
        preferred_salary_min: data.preferences.preferredSalary.min || 0,
        preferred_salary_max: data.preferences.preferredSalary.max || 0,
        preferred_locations: data.preferences.preferredLocation || [],
        work_arrangement: data.preferences.workArrangement || 'hybrid',
      };

      // Upsert profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) throw profileError;

      // Save work experience
      if (data.professionalInfo.workExperience && data.professionalInfo.workExperience.length > 0) {
        const workExpData = data.professionalInfo.workExperience.map(exp => ({
          user_id: userId,
          company: exp.company,
          position: exp.position,
          start_date: exp.startDate.toISOString().split('T')[0],
          end_date: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
          current: exp.current,
          description: exp.description || null,
        }));

        // Delete existing work experience
        await supabase.from('work_experience').delete().eq('user_id', userId);

        // Insert new work experience
        if (workExpData.length > 0) {
          const { error: workExpError } = await supabase
            .from('work_experience')
            .insert(workExpData);

          if (workExpError) throw workExpError;
        }
      }

      // Save education
      if (data.professionalInfo.education && data.professionalInfo.education.length > 0) {
        const educationData = data.professionalInfo.education.map(edu => ({
          user_id: userId,
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          start_date: edu.startDate.toISOString().split('T')[0],
          end_date: edu.endDate ? edu.endDate.toISOString().split('T')[0] : null,
          current: edu.current,
        }));

        // Delete existing education
        await supabase.from('education').delete().eq('user_id', userId);

        // Insert new education
        if (educationData.length > 0) {
          const { error: educationError } = await supabase
            .from('education')
            .insert(educationData);

          if (educationError) throw educationError;
        }
      }

      if (isMounted) {
        announce('Profil berhasil disimpan');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (isMounted) {
        announce('Terjadi kesalahan saat menyimpan profil');
      }
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

        {/* Voice Settings */}
        <div className="mt-8">
          <VoiceSettings />
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={learnerProfileTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="learner-profile"
        title="Tutorial Profil"
      />
    </div>
  );
}
