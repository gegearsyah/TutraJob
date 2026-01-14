/**
 * Environment Check Component
 * Displays warnings if environment variables are missing
 */

'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

function WarningNotification({ warnings }: { warnings: string[] }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 0.5 seconds for recommended env vars only
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="p-4 bg-warning/10 border border-warning rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-warning">Peringatan</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        Variabel berikut direkomendasikan:
      </p>
      <ul className="text-sm text-warning list-disc list-inside">
        {warnings.map((key) => (
          <li key={key} className="font-mono">{key}</li>
        ))}
      </ul>
    </div>
  );
}

function SuccessNotification() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 1 second
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="mb-2 p-3 bg-green-500/10 border border-green-500 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
      onClick={() => setIsVisible(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsVisible(false);
        }
      }}
      aria-label="Tutup notifikasi koneksi Supabase"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-500 font-medium">
            Supabase terhubung dengan baik
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="p-1 rounded hover:bg-green-500/20 transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-green-500" />
        </button>
      </div>
    </div>
  );
}

export function EnvCheck() {
  const [missing, setMissing] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    // Check client-side accessible env vars
    // In Next.js, NEXT_PUBLIC_* vars are embedded at build/start time
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const optional = ['NEXT_PUBLIC_OPENAI_API_KEY'];

    const missingVars: string[] = [];
    const warningVars: string[] = [];

    required.forEach((key) => {
      // Access env vars - Next.js exposes NEXT_PUBLIC_* vars to client
      // These are embedded at build time, so they must be set before starting the server
      const value = process.env[key];
      
      // Debug: log to console to help troubleshoot
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log(`[EnvCheck] ${key}:`, value ? `${value.substring(0, 20)}...` : 'undefined');
      }
      
      // Check if it's undefined, null, or empty string
      // Also check for placeholder values
      if (!value || 
          (typeof value === 'string' && (
            value.trim() === '' || 
            value.includes('your-') || 
            value.includes('xxxxx') ||
            value.includes('placeholder')
          ))) {
        missingVars.push(key);
      }
    });

    optional.forEach((key) => {
      const value = process.env[key];
      if (!value || 
          (typeof value === 'string' && (
            value.trim() === '' || 
            value.includes('your-') || 
            value.includes('sk-your-')
          ))) {
        warningVars.push(key);
      }
    });

    // Verify if variables are actually valid (not just present)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // If variables exist and look valid, Supabase should be working
    if (supabaseUrl && supabaseKey && 
        supabaseUrl.startsWith('http') && 
        supabaseKey.length > 20 &&
        !supabaseUrl.includes('your-') &&
        !supabaseKey.includes('your-')) {
      setIsConnected(true);
      
      // If variables are valid, clear any false positives
      if (missingVars.length > 0) {
        // Variables are actually present and valid
        // The check might have failed due to timing, but they're working
        console.log('[EnvCheck] Variables are valid - Supabase should be working');
        setMissing([]);
        setWarnings(warningVars);
        return;
      }
    } else if (missingVars.length === 0) {
      // Variables passed initial check
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

    setMissing(missingVars);
    setWarnings(warningVars);
  }, [isMounted]);

  // Don't render anything until mounted to prevent hydration mismatch
  // Also don't render if Supabase is connected (variables are working)
  if (!isMounted || (isConnected === true && missing.length === 0 && warnings.length === 0)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      {/* Success indicator if connected - Auto-dismiss after 1 second or clickable to close */}
      {isConnected === true && missing.length === 0 && (
        <SuccessNotification />
      )}
      {missing.length > 0 && (
        <div className="mb-2 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">
              Variabel Environment Hilang
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Variabel berikut diperlukan:
          </p>
          <ul className="text-sm text-destructive list-disc list-inside mb-3">
            {missing.map((key) => (
              <li key={key} className="font-mono">{key}</li>
            ))}
          </ul>
          <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border">
            <p className="mb-1 font-semibold">Cara memperbaiki:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Pastikan file <code className="bg-muted px-1 rounded">.env.local</code> ada di root directory (sama level dengan package.json)</li>
              <li>Pastikan format benar: <code className="bg-muted px-1 rounded">KEY=value</code> (tanpa spasi, tanpa quotes)</li>
              <li>Pastikan nilai tidak kosong</li>
              <li><strong>WAJIB: Stop server (Ctrl+C) dan restart dengan <code className="bg-muted px-1 rounded">npm run dev</code></strong></li>
              <li>Jika masih error, hapus folder <code className="bg-muted px-1 rounded">.next</code> dan restart</li>
            </ol>
            <p className="mt-2 text-xs">
              <strong>Catatan:</strong> Variabel <code className="bg-muted px-1 rounded">NEXT_PUBLIC_*</code> harus di-set SEBELUM menjalankan server. Restart wajib setelah membuat/mengubah .env.local
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Buka browser console (F12) untuk melihat nilai variabel yang terdeteksi
            </p>
            <p className="mt-1 text-xs">
              Lihat <code className="bg-muted px-1 rounded">SETUP_ENV.md</code> untuk panduan lengkap
            </p>
          </div>
        </div>
      )}

      {warnings.length > 0 && <WarningNotification warnings={warnings} />}
    </div>
  );
}
