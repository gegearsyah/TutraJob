/**
 * Compliance Information Page
 * Detailed information about compliance and how it works
 */

'use client';

import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { Scale, Users, FileText, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';

export default function ComplianceInfoPage() {
  usePageAnnouncement('Informasi Kepatuhan', 'Pelajari tentang kepatuhan UU No. 8/2016 dan bagaimana sistem bekerja');

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Informasi Kepatuhan</h1>
          <p className="text-muted-foreground">
            Pelajari tentang peraturan dan bagaimana sistem kepatuhan bekerja
          </p>
        </div>

        {/* UU No. 8/2016 Overview */}
        <section className="space-y-4 p-6 border border-border rounded-lg bg-card">
          <FocusAnnouncement
            description="Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas"
            label="UU No. 8/2016"
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              UU No. 8/2016 tentang Penyandang Disabilitas
            </h2>
          </FocusAnnouncement>

          <div className="space-y-3">
            <p className="text-foreground">
              Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas mengatur hak dan kewajiban 
              terkait penyandang disabilitas di Indonesia, termasuk dalam bidang ketenagakerjaan.
            </p>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Ketentuan Ketenagakerjaan
              </h3>
              <p className="text-sm text-foreground">
                <strong>Pasal 53</strong> mewajibkan perusahaan dengan minimal <strong>100 karyawan</strong> untuk 
                mempekerjakan minimal <strong>2% Penyandang Disabilitas</strong> dari total karyawan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Perusahaan Wajib</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Minimal 100 karyawan</li>
                  <li>• Mempekerjakan minimal 2% PwD</li>
                  <li>• Menyediakan akomodasi yang wajar</li>
                  <li>• Menciptakan lingkungan kerja inklusif</li>
                </ul>
              </div>

              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Hak Penyandang Disabilitas</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Kesempatan kerja yang sama</li>
                  <li>• Akomodasi yang wajar</li>
                  <li>• Tidak ada diskriminasi</li>
                  <li>• Aksesibilitas di tempat kerja</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How Compliance Works */}
        <section className="space-y-4 p-6 border border-border rounded-lg bg-card">
          <FocusAnnouncement
            description="Bagaimana sistem kepatuhan bekerja di platform ini"
            label="Cara Kerja Sistem"
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Bagaimana Sistem Bekerja
            </h2>
          </FocusAnnouncement>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pendaftaran Perusahaan</h3>
                  <p className="text-sm text-muted-foreground">
                    Perusahaan mendaftar dan menyatakan bahwa mereka telah mematuhi peraturan, 
                    termasuk kuota 2% untuk Penyandang Disabilitas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pelacakan Kepatuhan</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistem melacak jumlah karyawan Penyandang Disabilitas yang dipekerjakan 
                    dan membandingkannya dengan kuota wajib.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Posting Lowongan</h3>
                  <p className="text-sm text-muted-foreground">
                    Perusahaan dapat memposting lowongan pekerjaan yang aksesibel, dengan 
                    informasi aksesibilitas lokasi dan akomodasi yang tersedia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Proses Rekrutmen</h3>
                  <p className="text-sm text-muted-foreground">
                    Platform menyediakan proses rekrutmen yang inklusif, dengan fitur 
                    aksesibilitas lengkap untuk semua kandidat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Laporan dan Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Perusahaan dapat melihat laporan kepatuhan, progress kuota, dan 
                    metrik rekrutmen untuk monitoring berkelanjutan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-4 p-6 border border-border rounded-lg bg-card">
          <FocusAnnouncement
            description="Manfaat menggunakan platform ini"
            label="Manfaat Platform"
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Manfaat Platform
            </h2>
          </FocusAnnouncement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Untuk Perusahaan
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Memenuhi kewajiban kepatuhan</li>
                <li>• Akses ke talent pool yang beragam</li>
                <li>• Pelacakan kepatuhan otomatis</li>
                <li>• Laporan dan analitik</li>
                <li>• Proses rekrutmen yang efisien</li>
              </ul>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Untuk Pencari Kerja
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Platform yang sepenuhnya aksesibel</li>
                <li>• Akses ke lowongan yang sesuai</li>
                <li>• Informasi aksesibilitas lokasi</li>
                <li>• Proses lamaran yang mudah</li>
                <li>• Dukungan screen reader dan keyboard</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="space-y-4 p-6 border border-border rounded-lg bg-card">
          <FocusAnnouncement
            description="Sumber daya dan informasi tambahan"
            label="Sumber Daya"
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Sumber Daya
            </h2>
          </FocusAnnouncement>

          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Dokumen Resmi</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas
              </p>
              <p className="text-xs text-muted-foreground">
                Dapat diakses melalui website resmi Kementerian Hukum dan HAM atau portal 
                peraturan perundang-undangan.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Dukungan</h3>
              <p className="text-sm text-muted-foreground">
                Jika Anda memiliki pertanyaan tentang kepatuhan atau membutuhkan bantuan, 
                silakan hubungi tim support kami.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
