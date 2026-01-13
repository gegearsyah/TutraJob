/**
 * Environment Variable Validation
 * Checks if required environment variables are set
 */

/**
 * Validate required environment variables
 * @returns Object with validation results
 */
export function validateEnv(): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Required variables
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  // Optional but recommended
  const optional = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  };

  // Check required
  Object.entries(required).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  });

  // Check optional
  Object.entries(optional).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      warnings.push(key);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Get environment variable with validation
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Environment variable value
 */
export function getEnv(key: string, defaultValue?: string): string {
  // For server-side, use process.env directly
  // For client-side, NEXT_PUBLIC_* vars are available
  const value = typeof window === 'undefined' 
    ? process.env[key]
    : process.env[`NEXT_PUBLIC_${key}`] || process.env[key];
  
  if (!value || value.trim() === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (typeof window === 'undefined') {
      // Server-side: throw error for missing required vars
      console.warn(`Environment variable ${key} is not set`);
    }
    return '';
  }
  
  return value;
}

/**
 * Check if feature is enabled
 * @param featureName - Name of the feature flag
 * @returns boolean
 */
export function isFeatureEnabled(featureName: string): boolean {
  const value = process.env[`FEATURE_${featureName.toUpperCase()}`];
  return value === 'true' || value === '1';
}

/**
 * Log environment validation results
 */
export function logEnvValidation(): void {
  if (typeof window !== 'undefined') return; // Only on server

  const validation = validateEnv();
  
  if (!validation.valid) {
    console.error('❌ Missing required environment variables:', validation.missing);
    console.error('Please check your .env.local file');
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables:', validation.warnings);
  }
  
  if (validation.valid && validation.warnings.length === 0) {
    console.log('✅ All environment variables are set');
  }
}
