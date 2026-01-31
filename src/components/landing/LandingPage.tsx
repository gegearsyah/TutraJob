'use client';

import { useEffect, useState } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import Link from 'next/link';
import {
  LandingAbout,
  LandingStatistic,
  LandingCreatorProfile,
  LandingEmployer,
  LandingArticle,
  LandingValue,
  LandingContact,
} from '@/types/landing';
import {
  Users,
  Briefcase,
  Building2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle2,
  Quote,
  FileText,
  Heart,
  Target,
  Lightbulb,
  Shield,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { PartnersCarousel } from './PartnersCarousel';
import { LandingNarrator } from './LandingNarrator';
import { LandingHeader } from './LandingHeader';
import CreatorsCarousel from './CreatorsCarousel';

interface LandingPageProps {
  about?: LandingAbout;
  statistics: LandingStatistic[];
  creators: LandingCreatorProfile[];
  employers: LandingEmployer[];
  articles: LandingArticle[];
  values: LandingValue[];
  contact: LandingContact[];
}

export function LandingPage({
  about,
  statistics,
  creators,
  employers,
  articles,
  values,
  contact,
}: LandingPageProps) {
  const isMounted = useIsMounted();
  const primaryCreator = creators[0];

  useEffect(() => {
    if (isMounted) {
      announce('Selamat datang di Inklusif Kerja. Platform rekrutmen yang mudah diakses untuk Indonesia.');
    }
  }, [isMounted]);

  const getStatIcon = (iconName?: string) => {
    switch (iconName) {
      case 'users':
        return Users;
      case 'briefcase':
        return Briefcase;
      case 'building':
        return Building2;
      default:
        return Users;
    }
  };

  const getValueIcon = (iconName?: string) => {
    switch (iconName) {
      case 'heart':
        return Heart;
      case 'target':
        return Target;
      case 'lightbulb':
        return Lightbulb;
      case 'shield':
        return Shield;
      default:
        return CheckCircle2;
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'phone':
        return Phone;
      case 'address':
        return MapPin;
      case 'social':
        return Globe;
      default:
        return Mail;
    }
  };

  const formatCategory = (value: string) => {
    return value
      .replace(/carrer/gi, 'career')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Transparent Header Navigation */}
      <LandingHeader />

      {/* Hero Section - Similar to Karier.mu */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden"
        aria-label="Bagian utama"
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Integrated Talent Development Solutions for Your{' '}
                <span className="text-secondary underline decoration-secondary decoration-2 underline-offset-4">
                  Business
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Optimalkan potensi talenta menjadi pemimpin kini dan masa depan.
              </p>
              <p className="text-base text-white/80">
                Platform rekrutmen yang mudah diakses untuk menghubungkan pencari kerja dengan perusahaan yang berkomitmen pada inklusi
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {(() => {
                  const learnerPortalProps = useFocusAnnouncement({
                    description: 'Portal Pencari Kerja. Klik untuk mengakses portal pencari kerja.',
                    label: 'Tombol Portal Pencari Kerja',
                    context: 'Tekan Enter untuk membuka Portal Pencari Kerja',
                    announceOnFocus: true,
                    announceOnLongPress: true,
                  });
                  return (
                    <Link
                      href="/apps/learner"
                      className="px-8 py-4 rounded-full bg-white text-primary hover:bg-white/90 transition-all duration-300 min-h-[56px] flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      {...learnerPortalProps}
                    >
                      Portal Pencari Kerja
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  );
                })()}
                {(() => {
                  const employerPortalProps = useFocusAnnouncement({
                    description: 'Portal Pemberi Kerja. Klik untuk mengakses portal pemberi kerja.',
                    label: 'Tombol Portal Pemberi Kerja',
                    context: 'Tekan Enter untuk membuka Portal Pemberi Kerja',
                    announceOnFocus: true,
                    announceOnLongPress: true,
                  });
                  return (
                    <Link
                      href="/apps/employer"
                      className="px-8 py-4 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 min-h-[56px] flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      {...employerPortalProps}
                    >
                      Portal Pemberi Kerja
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  );
                })()}
              </div>
            </div>
            {about?.image_url && (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={about.image_url}
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-image.svg';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section - Overlapping with Hero like Karier.mu */}
      {statistics.length > 0 && (
        <section
          className="py-12 px-4 -mt-16 relative z-20"
          aria-label="Statistik"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {statistics.map((stat) => {
                  const Icon = getStatIcon(stat.icon_name);
                  return (
                    <div
                      key={stat.id}
                      className="text-center"
                      role="article"
                      aria-labelledby={`stat-${stat.id}`}
                    >
                      <div className="text-5xl md:text-6xl font-bold mb-2 text-foreground" id={`stat-${stat.id}`}>
                        {stat.value.toLocaleString('id-ID')}
                        {stat.value > 0 && <span className="text-primary">+</span>}
                      </div>
                      <div className="text-lg md:text-xl font-semibold text-foreground mb-1">{stat.label_id}</div>
                      <div className="text-sm text-muted-foreground">{stat.label_en}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Employers Section - With Auto Carousel - Moved below Statistics */}
      {employers.length > 0 && (
        <section
          id="partners"
          className="py-20 px-4 bg-slate-50"
          aria-label="Mitra Perusahaan"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Partners Who Have Trusted Us
              </h2>
              <p className="text-xl text-muted-foreground">
                Mitra Perusahaan yang Telah Mempercayai Kami
              </p>
            </div>
            <PartnersCarousel employers={employers} />
          </div>
        </section>
      )}

      {/* About Us & Why We're Different */}
      {about && (
        <section
          id="about"
          className="py-20 px-4 bg-background"
          aria-label="Tentang Kami"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">{about.title}</h2>
                  {about.subtitle && (
                    <p className="text-2xl text-muted-foreground">{about.subtitle}</p>
                  )}
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{about.description}</p>
                </div>
              </div>
              {about.image_url && (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={about.image_url}
                    alt={about.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder-image.svg';
                    }}
                  />
                </div>
              )}
            </div>

            {about.why_different_title && about.why_different_items && about.why_different_items.length > 0 && (
              <div className="mt-20">
                <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
                  {about.why_different_title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {about.why_different_items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                      role="article"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-6">
                        <CheckCircle2 className="w-8 h-8 text-primary" aria-hidden="true" />
                      </div>
                      <h4 className="text-xl font-semibold mb-4 text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-base">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Creator Profiles - Carousel with Auto-scroll */}
      {creators.length > 0 && (
        <section
          id="creators"
          className="py-20 px-4 bg-white"
          aria-label="Profil Pembuat"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Dengar dari Tim Kami</h2>
              <p className="text-xl text-muted-foreground">Kenali para pengembang di balik platform ini</p>
            </div>

            <CreatorsCarousel creators={creators} autoplay={true} autoplayInterval={5000} />
          </div>
        </section>
      )}

      {/* Articles Section */}
      {articles.filter(a => a.type !== 'testimonial').length > 0 && (
        <section
          id="articles"
          className="py-20 px-4 bg-gradient-to-br from-card to-background"
          aria-label="Artikel dan Insights"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Artikel & Insights
              </h2>
              <p className="text-xl text-muted-foreground">
                Informasi edukatif seputar karir dan perkembangan diri
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.filter(a => a.type !== 'testimonial').map((article) => (
                <Link
                  key={article.id}
                  href={`/artikel/${article.id}`}
                  className="group bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  role="article"
                  aria-labelledby={`article-${article.id}`}
                >
                  {article.image_url && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {article.category && (
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                        {formatCategory(article.category)}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors" id={`article-${article.id}`}>
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">{article.content}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {article.published_at && (
                        <span>
                          {new Date(article.published_at).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {articles.filter(a => a.type === 'testimonial').length > 0 && (
        <section
          className="py-20 px-4 bg-background"
          aria-label="Testimoni Pengguna"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Testimoni Pengguna
              </h2>
              <p className="text-xl text-muted-foreground">
                Dengarkan kisah sukses dari pengguna kami
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.filter(a => a.type === 'testimonial').map((article) => (
                <article
                  key={article.id}
                  className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  role="article"
                  aria-labelledby={`testimonial-${article.id}`}
                >
                  <Quote className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                  <p className="text-muted-foreground mb-6 italic text-lg leading-relaxed">"{article.content}"</p>
                  {article.author_name && (
                    <div className="flex items-center gap-4">
                      {article.author_image_url && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={article.author_image_url}
                            alt={article.author_name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.svg';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold" id={`testimonial-${article.id}`}>{article.author_name}</div>
                        {article.author_title && (
                          <div className="text-sm text-muted-foreground">{article.author_title}</div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {values.length > 0 && (
        <section
          className="py-20 px-4 bg-background"
          aria-label="Nilai Organisasi"
        >
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Nilai Organisasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const Icon = getValueIcon(value.icon_name);
                return (
                  <div
                    key={value.id}
                    className="bg-card rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    role="article"
                    aria-labelledby={`value-${value.id}`}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                      <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3" id={`value-${value.id}`}>
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contact.length > 0 && (
        <section
          id="contact"
          className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5"
          aria-label="Kontak"
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Hubungi Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contact.map((item) => {
                const Icon = getContactIcon(item.contact_type);
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    role="article"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-lg">{item.label}</h3>
                      {item.contact_type === 'email' ? (
                        <a
                          href={`mailto:${item.value}`}
                          className="text-primary hover:underline min-h-[48px] flex items-center"
                          aria-label={`Email: ${item.value}`}
                        >
                          {item.value}
                        </a>
                      ) : item.contact_type === 'phone' ? (
                        <a
                          href={`tel:${item.value}`}
                          className="text-primary hover:underline min-h-[48px] flex items-center"
                          aria-label={`Telepon: ${item.value}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer - Similar to Karier.mu */}
      <footer className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Inklusif Kerja</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Platform Pengembangan Karier dengan Ekosistem Terbesar di Indonesia
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Platform rekrutmen yang mudah diakses untuk menghubungkan pencari kerja dengan perusahaan yang berkomitmen pada inklusi. Platform ini dirancang khusus untuk memastikan aksesibilitas penuh bagi semua pengguna.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/apps/learner" className="text-muted-foreground hover:text-primary transition-colors min-h-[48px] flex items-center">
                    Portal Pencari Kerja
                  </Link>
                </li>
                <li>
                  <Link href="/apps/employer" className="text-muted-foreground hover:text-primary transition-colors min-h-[48px] flex items-center">
                    Portal Pemberi Kerja
                  </Link>
                </li>
                <li>
                  <Link href="/apps/learner/auth/login" className="text-muted-foreground hover:text-primary transition-colors min-h-[48px] flex items-center">
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link href="/apps/learner/auth/signup" className="text-muted-foreground hover:text-primary transition-colors min-h-[48px] flex items-center">
                    Daftar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Kontak</h4>
              <ul className="space-y-2">
                {contact.slice(0, 3).map((item) => {
                  const Icon = getContactIcon(item.contact_type);
                  return (
                    <li key={item.id} className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{item.value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Inklusif Kerja. All rights reserved.
              </p>
              <div className="flex gap-4">
                {primaryCreator?.social_links?.linkedin && (
                  <a
                    href={primaryCreator.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" aria-hidden="true" />
                  </a>
                )}
                {primaryCreator?.social_links?.twitter && (
                  <a
                    href={primaryCreator.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Narrator Control */}
      <LandingNarrator
        title="Integrated Talent Development Solutions for Your Business"
        subtitle="Optimalkan potensi talenta menjadi pemimpin kini dan masa depan"
        description="Platform rekrutmen yang mudah diakses untuk menghubungkan pencari kerja dengan perusahaan yang berkomitmen pada inklusi"
        autoPlay={true}
        disabled={true}
      />
    </div>
  );
}
