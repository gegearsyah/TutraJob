/**
 * Consent Form Component
 * Terms & Conditions and compliance consent form for registration
 */

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, FileText, Scale, Users, Shield } from 'lucide-react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { cn } from '@/lib/utils';

export type UserType = 'learner' | 'employer';

interface ConsentFormProps {
  userType: UserType;
  onConsentChange: (consented: boolean) => void;
  className?: string;
}

export function ConsentForm({ userType, onConsentChange, className }: ConsentFormProps) {
  const [consented, setConsented] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    onConsentChange(consented);
  }, [consented, onConsentChange]);

  const handleConsentChange = (checked: boolean) => {
    setConsented(checked);
    if (isMounted) {
      if (checked) {
        announce('Anda telah menyetujui syarat dan ketentuan');
        triggerHaptic('confirmation');
      } else {
        announce('Persetujuan dibatalkan');
        triggerHaptic('dismiss');
      }
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (isMounted) {
      announce(showDetails ? 'Detail syarat dan ketentuan disembunyikan' : 'Detail syarat dan ketentuan ditampilkan');
    }
  };

  const checkboxProps = useFocusAnnouncement({
    description: `Centang kotak ini untuk menyetujui syarat dan ketentuan. ${userType === 'learner' ? 'Sebagai pencari kerja, platform ini dirancang khusus untuk Anda dan mengikuti peraturan yang berlaku.' : 'Sebagai perusahaan, Anda menyatakan bahwa perusahaan Anda telah mematuhi peraturan dan menyediakan kebutuhan untuk Penyandang Disabilitas.'}`,
    label: 'Persetujuan Syarat dan Ketentuan',
    context: 'Tekan Space untuk mencentang atau menghapus centang',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const detailsButtonProps = useFocusAnnouncement({
    description: 'Klik untuk melihat detail lengkap syarat dan ketentuan serta informasi kepatuhan',
    label: 'Lihat Detail',
    context: 'Tekan Enter untuk melihat detail',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="p-4 border border-border rounded-lg bg-card">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Syarat dan Ketentuan</h3>
              <p className="text-sm text-muted-foreground">
                {userType === 'learner' ? (
                  <>
                    Dengan mendaftar, Anda menyetujui bahwa platform ini dirancang khusus untuk pencari kerja dengan disabilitas dan mengikuti peraturan yang berlaku, termasuk UU No. 8/2016 tentang Penyandang Disabilitas.
                  </>
                ) : (
                  <>
                    Dengan mendaftar, Anda menyatakan bahwa perusahaan Anda telah mematuhi peraturan yang berlaku, termasuk UU No. 8/2016 tentang Penyandang Disabilitas, dan menyediakan kebutuhan serta akomodasi yang diperlukan untuk Penyandang Disabilitas.
                  </>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDetails}
              className="text-sm text-primary hover:underline flex items-center gap-1"
              {...detailsButtonProps}
            >
              {showDetails ? (
                <>
                  <span>Sembunyikan detail</span>
                </>
              ) : (
                <>
                  <span>Lihat detail lengkap</span>
                </>
              )}
            </button>

            {showDetails && (
              <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <Scale className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                    <h4 className="font-semibold text-sm">Kepatuhan Peraturan</h4>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Platform ini mengikuti UU No. 8/2016 tentang Penyandang Disabilitas dan peraturan terkait lainnya. Kami berkomitmen untuk menyediakan platform yang aksesibel dan inklusif.
                  </p>
                </div>

                {userType === 'learner' ? (
                  <>
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                        <h4 className="font-semibold text-sm">Untuk Pencari Kerja</h4>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Platform ini dirancang khusus untuk membantu Anda menemukan pekerjaan yang sesuai. Kami menyediakan fitur aksesibilitas lengkap, termasuk dukungan screen reader, navigasi keyboard, dan feedback audio/haptic.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                        <h4 className="font-semibold text-sm">Privasi dan Keamanan</h4>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Informasi pribadi Anda dilindungi dan hanya dibagikan dengan perusahaan yang relevan untuk proses rekrutmen. Anda memiliki kontrol penuh atas data Anda.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                        <h4 className="font-semibold text-sm">Kewajiban Perusahaan</h4>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Sebagai perusahaan, Anda menyatakan bahwa perusahaan Anda telah mematuhi kuota wajib 2% untuk Penyandang Disabilitas sesuai UU No. 8/2016, menyediakan akomodasi yang diperlukan, dan menciptakan lingkungan kerja yang inklusif.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                        <h4 className="font-semibold text-sm">Komitmen Inklusivitas</h4>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Perusahaan Anda berkomitmen untuk menyediakan proses rekrutmen yang adil, tanpa diskriminasi, dan menyediakan akomodasi yang wajar untuk semua kandidat, termasuk Penyandang Disabilitas.
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5" aria-hidden="true" />
                    <h4 className="font-semibold text-sm">Penting</h4>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Dengan menyetujui, Anda mengakui bahwa Anda telah membaca dan memahami syarat dan ketentuan ini. Jika Anda tidak setuju, silakan hubungi tim support kami sebelum melanjutkan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => handleConsentChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          {...checkboxProps}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {consented ? (
              <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
            ) : null}
            <span className="font-medium text-sm">
              Saya menyetujui syarat dan ketentuan di atas
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {userType === 'learner' ? (
              'Saya memahami bahwa platform ini dirancang untuk pencari kerja dan mengikuti peraturan yang berlaku.'
            ) : (
              'Saya menyatakan bahwa perusahaan saya telah mematuhi peraturan dan menyediakan kebutuhan untuk Penyandang Disabilitas.'
            )}
          </p>
        </div>
      </label>
    </div>
  );
}
