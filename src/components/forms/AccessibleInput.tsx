/**
 * Accessible Input Component
 * Enhanced input with comprehensive accessibility features
 */

'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  format?: string;
  example?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoAnnounce?: boolean;
  suffix?: React.ReactNode; // For password toggle button, etc.
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      description,
      error,
      required,
      format,
      example,
      className,
      onFocus,
      onBlur,
      autoAnnounce = true,
      suffix,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);

    // Combine refs
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      // Announce when field is clicked - immediate feedback
      // NEVER announce password values - only announce field name
      if (autoAnnounce && typeof window !== 'undefined') {
        const isPassword = props.type === 'password' || inputId.toLowerCase().includes('password');
        const announcement = isPassword 
          ? `Anda mengklik field ${label}. Anda dapat mulai mengetik kata sandi sekarang.`
          : `Anda mengklik field ${label}. Anda dapat mulai mengetik sekarang.`;
        // Use Web Speech API directly for immediate feedback
        if ('speechSynthesis' in window) {
          // Stop any ongoing speech for immediate feedback
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(announcement);
          utterance.lang = 'id-ID';
          utterance.rate = 1.0;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (autoAnnounce && typeof window !== 'undefined') {
        // If focused via keyboard (not click), announce immediately
        // NEVER announce password values
        const isPassword = props.type === 'password' || inputId.toLowerCase().includes('password');
        const announcement = isPassword
          ? `Field ${label} difokuskan. Anda dapat mulai mengetik kata sandi.`
          : `Field ${label} difokuskan. Anda dapat mulai mengetik.`;
        if ('speechSynthesis' in window) {
          // Stop any ongoing speech
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(announcement);
          utterance.lang = 'id-ID';
          utterance.rate = 1.0;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (autoAnnounce && typeof window !== 'undefined') {
        // Announcement will be handled by useAccessibleForm hook
      }
      onBlur?.(e);
    };

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium"
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="wajib diisi">
              *
            </span>
          )}
        </label>

        {description && (
          <p
            id={descriptionId}
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            className={cn(
              'w-full min-h-[48px] px-4 py-2 border rounded-lg bg-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              error ? 'border-destructive' : 'border-input',
              suffix && 'pr-14',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={cn(
              description && descriptionId,
              error && errorId,
              format && `${inputId}-format`,
              example && `${inputId}-example`
            )}
            aria-required={required}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {error && !suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-destructive" aria-hidden="true" />
            </div>
          )}

          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>

        {/* Hidden format and example for screen readers */}
        {format && (
          <div id={`${inputId}-format`} className="sr-only">
            Format: {format}
          </div>
        )}

        {example && (
          <div id={`${inputId}-example`} className="sr-only">
            Contoh: {example}
          </div>
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm text-destructive flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {/* Live region for announcements */}
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
          id={`${inputId}-announcements`}
        />
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';
