'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingArticle } from '@/types/landing';
import { ArrowLeft, Calendar, User, Share2, Bookmark } from 'lucide-react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';

interface ArticleReaderProps {
  article: LandingArticle;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      announce(`Membaca artikel: ${article.title}`);
    }
  }, [isMounted, article.title]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCategory = (value: string) => {
    return value
      .replace(/carrer/gi, 'career')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <Link
              href="/#articles"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Artikel</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Simpan artikel"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Bagikan artikel"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content - Medium Style */}
      <article className="py-12">
        <div className="container max-w-3xl">
          {/* Article Header */}
          <header className="mb-12">
            {article.category && (
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {formatCategory(article.category)}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex items-center gap-4 mb-8">
              {article.author_image_url && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={article.author_image_url}
                    alt={article.author_name || 'Author'}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.svg';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                {article.author_name && (
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    {article.author_name}
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {(article.published_at || article.created_at) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatDate(article.published_at || article.created_at)}
                    </span>
                  )}
                  <span>•</span>
                  <span>{Math.ceil(article.content.split(' ').length / 200)} menit baca</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-12 shadow-lg">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder-image.svg';
                }}
              />
            </div>
          )}

          {/* Article Body - Medium-style typography */}
          <div className="prose prose-lg prose-slate max-w-none
                         prose-headings:font-bold prose-headings:tracking-tight
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                         prose-p:text-lg prose-p:leading-8 prose-p:mb-6 prose-p:text-gray-700
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-gray-900 prose-strong:font-semibold
                         prose-blockquote:border-l-4 prose-blockquote:border-primary 
                         prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                         prose-ul:my-6 prose-ol:my-6
                         prose-li:text-lg prose-li:leading-7 prose-li:my-2
                         prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                         prose-img:rounded-xl prose-img:shadow-md">
            {article.content.split('\n\n').map((paragraph, index) => {
              // Check if paragraph is a heading
              if (paragraph.startsWith('# ')) {
                return <h2 key={index}>{paragraph.slice(2)}</h2>;
              } else if (paragraph.startsWith('## ')) {
                return <h3 key={index}>{paragraph.slice(3)}</h3>;
              } else if (paragraph.startsWith('> ')) {
                return <blockquote key={index}>{paragraph.slice(2)}</blockquote>;
              } else if (paragraph.trim()) {
                return <p key={index}>{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            {article.author_name && (
              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border">
                {article.author_image_url && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
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
                  <div className="font-semibold text-lg mb-1">{article.author_name}</div>
                  {article.author_title && (
                    <div className="text-muted-foreground mb-2">{article.author_title}</div>
                  )}
                </div>
              </div>
            )}
          </footer>
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="py-12 bg-muted/30 border-t">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placeholder for related articles - will be populated later */}
            <div className="text-center text-muted-foreground py-8">
              Artikel terkait akan ditampilkan di sini
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
