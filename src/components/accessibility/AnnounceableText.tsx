/**
 * Component for text elements that should announce details on focus/long press
 * Useful for important information like dates, status, counts, etc.
 */

'use client';

import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { cn } from '@/lib/utils';

interface AnnounceableTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  description: string;
  label?: string;
  context?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  announceOnFocus?: boolean;
  announceOnLongPress?: boolean;
  className?: string;
}

export function AnnounceableText({
  children,
  description,
  label,
  context,
  as: Component = 'span',
  announceOnFocus = true,
  announceOnLongPress = true,
  className,
  ...props
}: AnnounceableTextProps) {
  const announcementProps = useFocusAnnouncement({
    description,
    label,
    context,
    announceOnFocus,
    announceOnLongPress,
  });

  return (
    <Component
      {...props}
      {...announcementProps}
      className={cn('cursor-default', className)}
      tabIndex={0}
    >
      {children}
    </Component>
  );
}
