/**
 * Hook to check if component is mounted (client-side only)
 * Prevents hydration mismatches by ensuring code only runs on client
 */

import { useState, useEffect } from 'react';

/**
 * Returns true only after component has mounted on client
 * Use this to prevent hydration mismatches with browser APIs
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
