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
  size?: 'sm' | 'md' | 'lg';
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
      size = 'md',
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

    const baseStyles = 'min-w-[48px] rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles: Record<string, string> = {
      sm: 'px-2 py-1 text-sm min-h-[40px] min-w-[40px]',
      md: 'px-4 py-2 min-h-[48px] text-base',
      lg: 'px-6 py-3 min-h-[56px] text-lg',
    };

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-border bg-background hover:bg-muted',
      ghost: 'hover:bg-muted',
      link: 'text-primary hover:underline bg-transparent border-none shadow-none',
    };

    const combinedClass = cn(
      baseStyles,
      sizeStyles[size],
      variants[variant],
      'inline-flex items-center justify-center gap-2',
      className
    );

    if (asLink && href) {
      return (
        <Link
          href={href}
          className={combinedClass}
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
        className={combinedClass}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
