import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <FileQuestion className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8">
          Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-h-[48px]"
        >
          <Home className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
