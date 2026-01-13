/**
 * Accessible Form Hook
 * Provides enhanced accessibility features for forms
 */

import { useEffect, useRef, useState } from 'react';
import { FieldErrors, UseFormReturn, FieldValues } from 'react-hook-form';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface FieldDescription {
  label: string;
  description: string;
  placeholder?: string;
  required?: boolean;
  format?: string; // e.g., "DD/MM/YYYY", "email format"
  example?: string;
}

interface UseAccessibleFormOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldDescriptions: Record<string, FieldDescription>;
  autoNavigateOnError?: boolean;
  announceOnFocus?: boolean;
  announceOnBlur?: boolean;
}

export function useAccessibleForm<T extends FieldValues>({
  form,
  fieldDescriptions,
  autoNavigateOnError = true,
  announceOnFocus = true,
  announceOnBlur = true,
}: UseAccessibleFormOptions<T>) {
  const { errors, trigger, watch } = form;
  const isMounted = useIsMounted();
  const previousErrorsRef = useRef<FieldErrors<T>>({});
  const focusedFieldRef = useRef<string | null>(null);

  // Track field focus for announcements
  const handleFieldFocus = (fieldName: string, eventType: 'focus' | 'click' = 'focus') => {
    if (!isMounted || !announceOnFocus) return;

    const fieldDesc = fieldDescriptions[fieldName];
    if (!fieldDesc) return;

    focusedFieldRef.current = fieldName;

    // Immediate confirmation when clicked
    if (eventType === 'click') {
      announce(`Anda mengklik field ${fieldDesc.label}. Anda dapat mulai mengetik sekarang.`);
      triggerHaptic('loading');
      
      // Then announce full details after a short delay
      setTimeout(() => {
        let announcement = `${fieldDesc.label}.`;
        
        if (fieldDesc.description) {
          announcement += ` ${fieldDesc.description}.`;
        }

        if (fieldDesc.required) {
          announcement += ' Field ini wajib diisi.';
        }

        if (fieldDesc.format) {
          announcement += ` Format: ${fieldDesc.format}.`;
        }

        if (fieldDesc.example) {
          announcement += ` Contoh: ${fieldDesc.example}.`;
        }

        if (fieldDesc.placeholder) {
          announcement += ` Placeholder: ${fieldDesc.placeholder}.`;
        }

        // Check if field has error
        const fieldError = getNestedError(errors, fieldName);
        if (fieldError) {
          announcement += ` Error: ${fieldError.message || 'Field ini memiliki error'}.`;
        }

        announce(announcement);
      }, 500);
    } else {
      // Standard focus announcement
      let announcement = `Field ${fieldDesc.label} difokuskan. Anda dapat mulai mengetik.`;
      
      if (fieldDesc.description) {
        announcement += ` ${fieldDesc.description}.`;
      }

      if (fieldDesc.required) {
        announcement += ' Field ini wajib diisi.';
      }

      if (fieldDesc.format) {
        announcement += ` Format: ${fieldDesc.format}.`;
      }

      if (fieldDesc.example) {
        announcement += ` Contoh: ${fieldDesc.example}.`;
      }

      if (fieldDesc.placeholder) {
        announcement += ` Placeholder: ${fieldDesc.placeholder}.`;
      }

      // Check if field has error
      const fieldError = getNestedError(errors, fieldName);
      if (fieldError) {
        announcement += ` Error: ${fieldError.message || 'Field ini memiliki error'}.`;
      }

      announce(announcement);
      triggerHaptic('loading');
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    if (!isMounted || !announceOnBlur) return;

    const fieldDesc = fieldDescriptions[fieldName];
    if (!fieldDesc) return;

    const fieldValue = getNestedValue(watch(), fieldName);
    const fieldError = getNestedError(errors, fieldName);

    if (fieldError) {
      announce(`Error di ${fieldDesc.label}: ${fieldError.message || 'Field ini memiliki error'}.`);
      triggerHaptic('error');
    } else if (fieldValue && fieldValue !== '') {
      announce(`${fieldDesc.label} telah diisi.`);
      triggerHaptic('confirmation');
    }

    focusedFieldRef.current = null;
  };

  // Monitor errors and announce changes
  useEffect(() => {
    if (!isMounted) return;

    const currentErrors = errors;
    const previousErrors = previousErrorsRef.current;

    // Find new errors
    const newErrors = findNewErrors(previousErrors, currentErrors);
    
    if (newErrors.length > 0 && focusedFieldRef.current === null) {
      // Only announce if user is not currently focused on a field
      const firstError = newErrors[0];
      const fieldDesc = fieldDescriptions[firstError.field];
      
      if (fieldDesc) {
        announce(`Error: ${fieldDesc.label}. ${firstError.message}.`);
        triggerHaptic('error');
      }
    }

    previousErrorsRef.current = currentErrors;
  }, [errors, fieldDescriptions, isMounted]);

  // Auto-navigate to first error on submit
  const navigateToFirstError = () => {
    if (!autoNavigateOnError || !isMounted) return;

    const firstErrorField = findFirstErrorField(errors);
    if (firstErrorField) {
      const fieldElement = document.querySelector(
        `[name="${firstErrorField}"], [id="${firstErrorField}"]`
      ) as HTMLElement;

      if (fieldElement) {
        setTimeout(() => {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          fieldElement.focus();
          
          const fieldDesc = fieldDescriptions[firstErrorField];
          if (fieldDesc) {
            announce(`Fokus dipindahkan ke ${fieldDesc.label} karena ada error. ${getNestedError(errors, firstErrorField)?.message || ''}`);
            triggerHaptic('error');
          }
        }, 300);
      }
    }
  };

  // Get validation summary
  const getValidationSummary = () => {
    const errorCount = Object.keys(errors).length;
    const requiredFields = Object.entries(fieldDescriptions)
      .filter(([_, desc]) => desc.required)
      .map(([name, desc]) => ({ name, label: desc.label }));

    const filledFields = requiredFields.filter(({ name }) => {
      const value = getNestedValue(watch(), name);
      return value && value !== '' && value !== null && value !== undefined;
    });

    const missingFields = requiredFields.filter(({ name }) => {
      const value = getNestedValue(watch(), name);
      return !value || value === '' || value === null || value === undefined;
    });

    return {
      errorCount,
      totalRequired: requiredFields.length,
      filled: filledFields.length,
      missing: missingFields.length,
      missingFields: missingFields.map(f => f.label),
      errors: Object.entries(errors).map(([field, error]) => ({
        field,
        label: fieldDescriptions[field]?.label || field,
        message: getNestedError(errors, field)?.message || 'Error',
      })),
    };
  };

  // Announce validation summary
  const announceValidationSummary = () => {
    if (!isMounted) return;

    const summary = getValidationSummary();
    
    if (summary.errorCount === 0 && summary.missing === 0) {
      announce('Form valid. Semua field telah diisi dengan benar.');
      triggerHaptic('apply-success');
    } else {
      let announcement = `Form memiliki ${summary.errorCount} error.`;
      
      if (summary.missing > 0) {
        announcement += ` ${summary.missing} field wajib belum diisi: ${summary.missingFields.join(', ')}.`;
      }

      if (summary.errors.length > 0) {
        const firstError = summary.errors[0];
        announcement += ` Error pertama: ${firstError.label}. ${firstError.message}.`;
      }

      announce(announcement);
      triggerHaptic('error');
    }
  };

  return {
    handleFieldFocus,
    handleFieldBlur,
    navigateToFirstError,
    getValidationSummary,
    announceValidationSummary,
  };
}

// Helper functions
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

function getNestedError(errors: FieldErrors<any>, path: string): { message?: string } | undefined {
  return path.split('.').reduce((current, prop) => current?.[prop], errors as any);
}

function findNewErrors(
  previous: FieldErrors<any>,
  current: FieldErrors<any>
): Array<{ field: string; message: string }> {
  const newErrors: Array<{ field: string; message: string }> = [];

  function traverse(obj: any, path: string = '') {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (obj[key]?.message) {
        // Check if this is a new error
        const prevError = getNestedError(previous, currentPath);
        if (!prevError) {
          newErrors.push({
            field: currentPath,
            message: obj[key].message || 'Error',
          });
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key], currentPath);
      }
    }
  }

  traverse(current);
  return newErrors;
}

function findFirstErrorField(errors: FieldErrors<any>): string | null {
  function traverse(obj: any, path: string = ''): string | null {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (obj[key]?.message) {
        return currentPath;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = traverse(obj[key], currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  return traverse(errors);
}
