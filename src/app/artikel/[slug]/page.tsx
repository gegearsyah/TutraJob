'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArticleReader } from '@/components/landing/ArticleReader';
import { LandingArticle } from '@/types/landing';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<LandingArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch(`/api/landing/articles/${slug}`);
        const result = await response.json();

        if (!response.ok || !result?.data) {
          console.error('Error loading article:', result?.error || result);
          setError(true);
        } else {
          setArticle(result.data as LandingArticle);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-h-[48px]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return <ArticleReader article={article} />;
}
