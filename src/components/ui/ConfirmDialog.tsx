'use client';

import { useEffect } from 'react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
        <h2 id="confirm-dialog-title" className="text-xl font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <AccessibleButton
            onClick={onCancel}
            variant="outline"
            announcementText="Membatalkan"
          >
            {cancelLabel}
          </AccessibleButton>
          <AccessibleButton
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            announcementText="Menghapus"
          >
            {confirmLabel}
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
