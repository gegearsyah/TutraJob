/**
 * Accessible Button Component
 * Button with enhanced accessibility features for blind users
 */

'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  asLink?: boolean;
  href?: string;
  announceOnClick?: boolean;
  announcementText?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      asLink = false,
      href,
      announceOnClick = true,
      announcementText,
      onClick,
      ...props
    },
    ref
  ) => {
    const isMounted = useIsMounted();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (announceOnClick && isMounted) {
        const text = announcementText || (typeof children === 'string' ? children : 'Tombol diklik');
        announce(text);
        triggerHaptic('loading');
      }
      onClick?.(e);
    };

    const baseStyles = 'min-h-[48px] min-w-[48px] px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-border bg-background hover:bg-muted',
      ghost: 'hover:bg-muted',
      link: 'text-primary hover:underline bg-transparent border-none shadow-none',
    };

    if (asLink && href) {
      return (
        <Link
          href={href}
          className={cn(
            baseStyles,
            variants[variant],
            'inline-flex items-center justify-center gap-2 text-center',
            className
          )}
          onClick={(e) => {
            if (announceOnClick && isMounted) {
              const text = announcementText || (typeof children === 'string' ? children : 'Link diklik');
              announce(text);
              triggerHaptic('loading');
            }
          }}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          'inline-flex items-center justify-center gap-2',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
