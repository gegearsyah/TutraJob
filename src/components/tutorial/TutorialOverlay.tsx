/**
 * Tutorial Overlay Component
 * Step-by-step tutorial system with accessibility features
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, SkipForward, CheckCircle } from 'lucide-react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { useGestureDetection } from '@/lib/gestures';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { cn } from '@/lib/utils';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  audioDescription?: string; // Extended description for audio
  targetSelector?: string; // CSS selector to highlight
  targetButtonLabel?: string; // Label of button to click (for blind users)
  targetButtonInstructions?: string; // Specific instructions on how to find/click the button
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Action to perform when step is shown
  beforeAction?: () => void; // Action before showing step
  keyboardHint?: string; // Keyboard shortcut hint
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tutorialId: string; // Unique ID for this tutorial
  title?: string;
}

export function TutorialOverlay({
  steps,
  isOpen,
  onClose,
  onComplete,
  tutorialId,
  title = 'Tutorial',
}: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [nextButtonRef, setNextButtonRef] = useState<HTMLButtonElement | null>(null);
  const [descriptionRef, setDescriptionRef] = useState<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();

  const handleNext = () => {
    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    if (isMounted) {
      announce('Langkah berikutnya');
      triggerHaptic('apply-success');
    }
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    const isFirstStep = currentStep === 0;
    if (!isFirstStep) {
      if (isMounted) {
        announce('Langkah sebelumnya');
        triggerHaptic('dismiss');
      }
      setCurrentStep((prev) => prev - 1);
    } else {
      if (isMounted) {
        announce('Ini adalah langkah pertama');
      }
    }
  };

  const handleSkip = () => {
    if (isMounted) {
      announce('Tutorial dilewati');
      triggerHaptic('dismiss');
    }
    onClose();
  };

  const handleComplete = () => {
    if (isMounted) {
      announce('Tutorial selesai! Selamat menggunakan aplikasi.');
      triggerHaptic('apply-success');
    }
    // Save completion to localStorage
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('tutorials_completed') || '[]');
      if (!completed.includes(tutorialId)) {
        completed.push(tutorialId);
        localStorage.setItem('tutorials_completed', JSON.stringify(completed));
      }
    }
    onComplete();
  };

  // Add swipe gesture support for tutorial navigation
  const gestureHandlers = useGestureDetection({
    onFlickRight: () => {
      // Swipe right = Next step
      handleNext();
    },
    onFlickLeft: () => {
      // Swipe left = Previous step
      handlePrevious();
    },
    onSwipeDown: () => {
      // Swipe down = Skip tutorial
      handleSkip();
    },
  });

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const step = steps[currentStep];
    if (!step) return;

    // Build comprehensive announcement for blind users
    // Focus on the step content, not navigation buttons
    let announcement = step.audioDescription || `${step.title}. ${step.description}`;
    
    // Add button instructions if target button is specified
    if (step.targetButtonLabel) {
      announcement += `. ${step.targetButtonInstructions || `Cari dan klik tombol "${step.targetButtonLabel}"`}.`;
    }
    
    // Add keyboard navigation hints (but don't focus on them)
    const keyboardHints: string[] = [];
    if (step.keyboardHint) {
      keyboardHints.push(step.keyboardHint);
    }
    keyboardHints.push('Gunakan Tab untuk navigasi, Enter untuk mengaktifkan.');
    keyboardHints.push('Geser kanan untuk langkah berikutnya, geser kiri untuk langkah sebelumnya.');
    
    announcement += ` ${keyboardHints.join(' ')}`;
    
    // Announce step with all instructions
    // This will be read first, then screen reader will read the focused description
    setTimeout(() => {
      announce(announcement);
    }, 300);

    // Trigger haptic feedback
    triggerHaptic('loading');

    // Execute before action
    if (step.beforeAction) {
      step.beforeAction();
    }

    // Highlight target element (but don't focus it - focus on description instead)
    if (step.targetSelector) {
      const element = document.querySelector(step.targetSelector) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Don't focus the target element - let screen reader read the tutorial description first
      } else {
        setHighlightedElement(null);
      }
    } else {
      setHighlightedElement(null);
    }

    // Focus on the tutorial description/content instead of buttons
    // This is more helpful for blind users - they hear the step content first
    setTimeout(() => {
      if (descriptionRef) {
        descriptionRef.focus();
        // Screen reader will automatically read the focused content
        // No need for additional announcement - the step description was already announced
      }
    }, 800);

    // Execute action
    if (step.action) {
      setTimeout(() => {
        step.action?.();
      }, 500);
    }
  }, [currentStep, isOpen, steps, isMounted, descriptionRef]);

  if (!isOpen || !isMounted) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = highlightedElement.getBoundingClientRect();
    const position = step.position || 'bottom';

    switch (position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translate(0, -50%)',
        };
      default:
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)',
        };
    }
  };

  return (
    <>
      {/* Overlay - Mobile optimized */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60"
        onClick={handleSkip}
        onTouchStart={(e) => {
          // On mobile, only skip if touching overlay (not tooltip)
          if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
            handleSkip();
          }
        }}
        aria-hidden="true"
      />

      {/* Highlight */}
      {highlightedElement && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            border: '3px solid #f59e0b',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip - Mobile optimized */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] w-[calc(100%-2rem)] max-w-md bg-card border border-border rounded-lg shadow-xl p-4 sm:p-6"
        style={{
          ...(typeof window !== 'undefined' && window.innerWidth < 640 ? {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: 'calc(100% - 2rem)',
          } : getTooltipPosition()),
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-description"
        {...gestureHandlers}
        onTouchStart={(e) => {
          // Prevent overlay click from triggering when touching tooltip
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Prevent overlay click from triggering when clicking tooltip
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          // Keyboard navigation for tutorial
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleNext();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            handlePrevious();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            handleSkip();
          }
        }}
        tabIndex={-1}
      >
        {/* Header - Mobile optimized */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 id="tutorial-title" className="text-base sm:text-lg font-semibold mb-1">
              {title}
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="whitespace-nowrap">
                Langkah {currentStep + 1} dari {steps.length}
              </span>
              <div className="w-full sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="min-w-[48px] min-h-[48px] p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Lewati tutorial"
            onTouchStart={(e) => {
              e.stopPropagation();
              if (isMounted) {
                triggerHaptic('dismiss');
              }
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Focusable for screen readers - Mobile optimized */}
        <div 
          id="tutorial-description" 
          ref={setDescriptionRef}
          className="mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-2 -m-2 max-h-[40vh] sm:max-h-none overflow-y-auto"
          tabIndex={0}
          role="region"
          aria-label={`Langkah ${currentStep + 1}: ${step.title}`}
        >
          <h4 className="text-sm sm:text-base font-medium mb-2">{step.title}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {step.description}
          </p>
          {step.targetButtonLabel && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-primary mb-1">
                Tindakan yang diperlukan:
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {step.targetButtonInstructions || `Klik tombol "${step.targetButtonLabel}"`}
              </p>
            </div>
          )}
        </div>

        {/* Navigation hints for screen readers - only read when user navigates to buttons */}
        <div id="tutorial-navigation-hint" className="sr-only" aria-live="polite">
          Navigasi tutorial: Tekan Tab untuk berpindah ke tombol navigasi. Geser kanan untuk langkah berikutnya, geser kiri untuk langkah sebelumnya.
        </div>

        {/* Actions - Mobile optimized */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex-1 sm:flex-initial"
            aria-label="Langkah sebelumnya, tekan Enter atau geser kiri"
            aria-disabled={isFirstStep}
            onFocus={() => {
              // Only announce when user actually focuses on button (via Tab navigation)
              if (isMounted && !isFirstStep) {
                announce('Fokus pada tombol Langkah sebelumnya. Tekan Enter untuk kembali.');
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (!isFirstStep && isMounted) {
                triggerHaptic('loading');
              }
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors min-h-[48px] flex-1 sm:flex-initial"
            aria-label="Lewati tutorial, tekan Enter atau geser bawah"
            onTouchStart={(e) => {
              e.stopPropagation();
              if (isMounted) {
                triggerHaptic('dismiss');
              }
            }}
          >
            <SkipForward className="w-5 h-5" />
            <span>Lewati</span>
          </button>

          <button
            ref={(el) => setNextButtonRef(el)}
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[48px] flex-1 sm:flex-initial"
            aria-label={isLastStep ? 'Selesai tutorial' : 'Langkah berikutnya, tekan Enter atau geser kanan'}
            aria-describedby="tutorial-navigation-hint"
            onFocus={() => {
              // Only announce when user actually focuses on button (via Tab navigation)
              if (isMounted) {
                const buttonLabel = isLastStep ? 'Selesai tutorial' : 'Langkah berikutnya';
                announce(`Fokus pada tombol ${buttonLabel}. Tekan Enter untuk melanjutkan.`);
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (isMounted) {
                triggerHaptic('apply-success');
              }
            }}
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Selesai</span>
              </>
            ) : (
              <>
                <span>Berikutnya</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
