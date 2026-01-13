/**
 * Notification Center Component
 * Displays haptic + audio notifications for status updates
 */

'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptic';
import { announce } from '@/lib/audio';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useIsMounted();

  // Listen for new notifications
  useEffect(() => {
    if (!isMounted) return;

    // Example: Listen for application status updates
    // This would be connected to Supabase real-time or WebSocket
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      
      // Haptic + Audio feedback
      triggerHaptic('confirmation');
      announce(`${notification.title}. ${notification.message}`);
    };

    // TODO: Connect to real-time notification system
    // supabase.channel('notifications').on('postgres_changes', ...)

    return () => {
      // Cleanup
    };
  }, [isMounted]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Notifikasi</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-muted min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 rounded hover:bg-muted min-h-[24px] min-w-[24px] flex items-center justify-center flex-shrink-0"
                          aria-label="Hapus notifikasi"
                        >
                          <X className="w-3 h-3" />
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
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
                className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tandai semua sudah dibaca
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to show notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isMounted = useIsMounted();

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    if (!isMounted) return;

    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);

    // Haptic + Audio feedback
    const hapticPatterns: Record<NotificationType, 'confirmation' | 'error' | 'loading'> = {
      success: 'confirmation',
      error: 'error',
      warning: 'confirmation',
      info: 'loading',
    };

    triggerHaptic(hapticPatterns[type] || 'confirmation');
    announce(`${title}. ${message}`);
  };

  return { notifications, showNotification };
}
