/**
 * Wrapper component for adding focus/long press announcements to any element
 * 
 * Usage:
 * ```tsx
 * <FocusAnnouncement
 *   description="Menu untuk melihat semua pekerjaan yang tersedia"
 *   label="Cari Pekerjaan"
 *   context="Tekan Enter untuk membuka halaman"
 * >
 *   <Link href="/jobs">Cari Pekerjaan</Link>
 * </FocusAnnouncement>
 * ```
 */

'use client';

import { cloneElement, isValidElement, ReactElement } from 'react';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

interface FocusAnnouncementProps {
  children: ReactElement;
  description: string;
  label?: string;
  context?: string;
  announceOnFocus?: boolean;
  announceOnLongPress?: boolean;
  delay?: number;
  isNavigation?: boolean;
}

export function FocusAnnouncement({
  children,
  description,
  label,
  context,
  announceOnFocus = true,
  announceOnLongPress = true,
  delay = 300,
  isNavigation = false,
}: FocusAnnouncementProps) {
  const announcementProps = useFocusAnnouncement({
    description,
    label,
    context,
    announceOnFocus,
    announceOnLongPress,
    delay,
    isNavigation,
  });

  if (!isValidElement(children)) {
    return children;
  }

  // Merge announcement props with existing props
  const existingProps = children.props as Record<string, any>;
  const mergedProps: Record<string, any> = {
    ...existingProps,
    'aria-label': announcementProps['aria-label'] || existingProps['aria-label'],
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      announcementProps.onFocus?.(e);
      existingProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      announcementProps.onBlur?.(e);
      existingProps.onBlur?.(e);
    },
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
      announcementProps.onTouchStart?.(e);
      existingProps.onTouchStart?.(e);
    },
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
      announcementProps.onTouchEnd?.(e);
      existingProps.onTouchEnd?.(e);
    },
    onTouchCancel: (e: React.TouchEvent<HTMLElement>) => {
      announcementProps.onTouchCancel?.(e);
      existingProps.onTouchCancel?.(e);
    },
  };

  return cloneElement(children, mergedProps);
}
