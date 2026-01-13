/**
 * Notification Item Component with Focus/Long Press Announcements
 */

'use client';

import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/components/notifications/NotificationCenter';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  getIcon: (type: NotificationType) => React.ReactNode;
}

export function NotificationItem({
  notification,
  onRemove,
  getIcon,
}: NotificationItemProps) {
  const notificationProps = useFocusAnnouncement({
    description: `Notifikasi ${notification.type === 'success' ? 'berhasil' : notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'peringatan' : 'informasi'}: ${notification.title}. ${notification.message}. Diterima pada ${new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(notification.timestamp)}. ${!notification.read ? 'Belum dibaca.' : 'Sudah dibaca.'}`,
    label: notification.title,
    context: 'Tekan Enter untuk melihat detail',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const removeButtonProps = useFocusAnnouncement({
    description: `Hapus notifikasi "${notification.title}" dari daftar`,
    label: 'Tombol Hapus Notifikasi',
    context: 'Tekan Enter untuk menghapus',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div
      className={cn(
        'p-4 hover:bg-muted/50 transition-colors',
        !notification.read && 'bg-primary/5'
      )}
      tabIndex={0}
      {...notificationProps}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true">{getIcon(notification.type)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <button
              onClick={() => onRemove(notification.id)}
              className="p-1 rounded hover:bg-muted min-h-[24px] min-w-[24px] flex items-center justify-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Hapus notifikasi"
              {...removeButtonProps}
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Intl.DateTimeFormat('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(notification.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
