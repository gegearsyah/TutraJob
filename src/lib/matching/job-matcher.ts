/**
 * Smart Job Matching Algorithm
 * Matches jobs to user profile based on skills, location, accessibility, etc.
 */

import type { JobListing } from '@/types/job';
import type { UserProfile, UserPreferences, AccessibilityInfo, ProfessionalInfo } from '@/types/user';

export interface MatchScore {
  jobId: string;
  score: number; // 0-100
  breakdown: {
    skills: number; // 0-100
    location: number; // 0-100
    accessibility: number; // 0-100
    salary: number; // 0-100
    workArrangement: number; // 0-100
  };
  reasons: string[]; // Reasons for match/mismatch
}

/**
 * Calculate skill match score
 */
function calculateSkillsMatch(
  jobRequirements: string[],
  userSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  if (jobRequirements.length === 0) {
    return { score: 100, matched: [], missing: [] };
  }

  // Normalize skills for comparison (lowercase, trim)
  const normalizedJobReqs = jobRequirements.map((r) =>
    r.toLowerCase().trim()
  );
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  // Check for exact matches
  const matched: string[] = [];
  const missing: string[] = [];

  normalizedJobReqs.forEach((req) => {
    // Check for exact match or partial match
    const found = normalizedUserSkills.some(
      (skill) =>
        skill.includes(req) ||
        req.includes(skill) ||
        skill === req
    );
    if (found) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const score = (matched.length / normalizedJobReqs.length) * 100;

  return { score, matched, missing };
}

/**
 * Calculate location match score
 */
function calculateLocationMatch(
  jobLocation: JobListing['location'],
  userPreferences?: {
    preferredCity?: string;
    maxDistanceFromTransJakarta?: number; // in meters
  }
): number {
  if (!userPreferences) return 50; // Neutral score if no preferences

  let score = 50; // Base score

  // City match
  if (
    userPreferences.preferredCity &&
    jobLocation?.city?.toLowerCase() ===
      userPreferences.preferredCity.toLowerCase()
  ) {
    score += 30;
  }

  // TransJakarta distance
  if (
    userPreferences.maxDistanceFromTransJakarta &&
    jobLocation?.transjakartaDistance
  ) {
    const distance = jobLocation.transjakartaDistance;
    const maxDistance = userPreferences.maxDistanceFromTransJakarta;

    if (distance <= maxDistance) {
      // Closer is better
      const distanceScore = ((maxDistance - distance) / maxDistance) * 20;
      score += distanceScore;
    } else {
      // Too far, reduce score
      score -= 20;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate accessibility match score
 */
function calculateAccessibilityMatch(
  jobAccessibility: JobListing['accessibility'],
  userNeeds?: {
    requiredLevel?: 'high' | 'medium' | 'low';
    requiredAccommodations?: string[];
  }
): number {
  if (!userNeeds || !jobAccessibility) return 50; // Neutral

  let score = 50;

  // Level match
  const levelScores: Record<string, number> = {
    high: 100,
    medium: 70,
    low: 40,
  };

  if (userNeeds.requiredLevel) {
    const jobLevel = jobAccessibility.level;
    const requiredLevel = userNeeds.requiredLevel;

    // High level matches all
    if (jobLevel === 'high') {
      score = 100;
    } else if (jobLevel === requiredLevel) {
      score = levelScores[jobLevel];
    } else if (requiredLevel === 'high' && jobLevel !== 'high') {
      score = 30; // High requirement not met
    } else {
      score = 50; // Partial match
    }
  }

  // Accommodation match
  if (
    userNeeds.requiredAccommodations &&
    userNeeds.requiredAccommodations.length > 0 &&
    jobAccessibility.details
  ) {
    const matchedAccommodations = userNeeds.requiredAccommodations.filter(
      (req) =>
        jobAccessibility.details?.some((detail) =>
          detail.toLowerCase().includes(req.toLowerCase())
        )
    );

    const accommodationScore =
      (matchedAccommodations.length /
        userNeeds.requiredAccommodations.length) *
      30;
    score = Math.min(100, score + accommodationScore);
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate salary match score
 */
function calculateSalaryMatch(
  jobSalary: JobListing['salary'],
  userPreferences?: {
    minSalary?: number;
    maxSalary?: number;
  }
): number {
  if (!userPreferences || !jobSalary) return 50; // Neutral

  const { minSalary, maxSalary } = userPreferences;
  const jobMin = jobSalary.min;
  const jobMax = jobSalary.max;

  if (!jobMin && !jobMax) return 50; // No salary info

  // If user has min requirement
  if (minSalary) {
    const jobSalaryValue = jobMax || jobMin || 0;
    if (jobSalaryValue >= minSalary) {
      // Meets minimum, calculate how much above
      const excess = jobSalaryValue - minSalary;
      const score = 50 + Math.min(50, (excess / minSalary) * 50);
      return Math.min(100, score);
    } else {
      // Below minimum
      return 20;
    }
  }

  // If user has max preference (don't want too high)
  if (maxSalary && jobMin) {
    if (jobMin <= maxSalary) {
      return 80; // Within range
    } else {
      return 30; // Too high
    }
  }

  return 50;
}

/**
 * Calculate work arrangement match score
 */
function calculateWorkArrangementMatch(
  jobArrangement: JobListing['workArrangement'],
  userPreference?: 'remote' | 'hybrid' | 'on-site'
): number {
  if (!userPreference) return 50; // Neutral

  // Remote matches all
  if (userPreference === 'remote') {
    if (jobArrangement === 'remote') return 100;
    if (jobArrangement === 'hybrid') return 80;
    return 40; // on-site
  }

  // Hybrid matches hybrid and remote
  if (userPreference === 'hybrid') {
    if (jobArrangement === 'hybrid') return 100;
    if (jobArrangement === 'remote') return 90;
    return 50; // on-site
  }

  // On-site matches all
  if (userPreference === 'on-site') {
    if (jobArrangement === 'on-site') return 100;
    if (jobArrangement === 'hybrid') return 70;
    return 30; // remote
  }

  return 50;
}

/**
 * Match jobs to user profile
 * @param jobs - List of jobs to match
 * @param userProfile - User profile with preferences and skills
 * @returns Array of match scores sorted by score (highest first)
 */
export function matchJobsToUser(
  jobs: JobListing[],
  userProfile: {
    professionalInfo?: ProfessionalInfo;
    preferences?: UserPreferences;
    accessibility?: AccessibilityInfo;
  }
): MatchScore[] {
  const matches: MatchScore[] = [];

  jobs.forEach((job) => {
    // Extract user skills
    const userSkills = userProfile.professionalInfo?.skills || [];

    // Calculate skill match
    const skillsMatch = calculateSkillsMatch(
      job.requirements || [],
      userSkills
    );

    // Calculate location match
    const preferredLocation = userProfile.preferences?.preferredLocation?.[0] || '';
    const locationMatch = calculateLocationMatch(job.location, {
      preferredCity: preferredLocation,
      maxDistanceFromTransJakarta: 1000, // Default 1km
    });

    // Calculate accessibility match
    const accessibilityMatch = calculateAccessibilityMatch(job.accessibility, {
      requiredLevel: 'high' as const, // Default to high for blind users
      requiredAccommodations: userProfile.accessibility?.accommodations,
    });

    // Calculate salary match
    const salaryMatch = calculateSalaryMatch(job.salary, {
      minSalary: userProfile.preferences?.preferredSalary?.min,
      maxSalary: userProfile.preferences?.preferredSalary?.max,
    });

    // Calculate work arrangement match
    const workArrangementMatch = calculateWorkArrangementMatch(
      job.workArrangement,
      userProfile.preferences?.workArrangement
    );

    // Weighted average (skills are most important)
    const weights = {
      skills: 0.35,
      location: 0.15,
      accessibility: 0.25,
      salary: 0.15,
      workArrangement: 0.10,
    };

    const totalScore =
      skillsMatch.score * weights.skills +
      locationMatch * weights.location +
      accessibilityMatch * weights.accessibility +
      salaryMatch * weights.salary +
      workArrangementMatch * weights.workArrangement;

    // Generate reasons
    const reasons: string[] = [];
    if (skillsMatch.score >= 80) {
      reasons.push(
        `Keterampilan cocok (${skillsMatch.matched.length} dari ${job.requirements?.length || 0} requirement)`
      );
    } else if (skillsMatch.score < 50) {
      reasons.push(
        `Beberapa keterampilan belum sesuai (${skillsMatch.missing.length} requirement belum terpenuhi)`
      );
    }

    if (accessibilityMatch >= 80) {
      reasons.push('Aksesibilitas sangat baik');
    } else if (accessibilityMatch < 50) {
      reasons.push('Aksesibilitas mungkin tidak sesuai kebutuhan');
    }

    if (locationMatch >= 70) {
      reasons.push('Lokasi sesuai preferensi');
    }

    if (salaryMatch >= 70) {
      reasons.push('Gaji sesuai ekspektasi');
    }

    matches.push({
      jobId: job.id,
      score: Math.round(totalScore),
      breakdown: {
        skills: Math.round(skillsMatch.score),
        location: Math.round(locationMatch),
        accessibility: Math.round(accessibilityMatch),
        salary: Math.round(salaryMatch),
        workArrangement: Math.round(workArrangementMatch),
      },
      reasons,
    });
  });

  // Sort by score (highest first)
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get match level description
 */
export function getMatchLevel(score: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
} {
  if (score >= 80) {
    return {
      level: 'excellent',
      label: 'Sangat Cocok',
      color: 'text-green-500',
    };
  } else if (score >= 60) {
    return {
      level: 'good',
      label: 'Cocok',
      color: 'text-blue-500',
    };
  } else if (score >= 40) {
    return {
      level: 'fair',
      label: 'Cukup Cocok',
      color: 'text-yellow-500',
    };
  } else {
    return {
      level: 'poor',
      label: 'Kurang Cocok',
      color: 'text-red-500',
    };
  }
}
