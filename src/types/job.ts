/**
 * Job Listing Types
 * Based on FEATURE_SPECIFICATION.md
 */

export interface JobLocation {
  address: string;
  city: string;
  district?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  transjakartaDistance?: number; // Distance in meters
  accessibility?: string; // e.g., "Wheelchair accessible entrance"
}

export interface JobSalary {
  min?: number;
  max?: number;
  currency: string; // "IDR"
  period: 'monthly' | 'yearly';
}

export interface JobAccessibility {
  level: 'high' | 'medium' | 'low';
  details: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: JobLocation;
  salary?: JobSalary;
  description: string;
  summary: string; // AI-generated summary for audio
  requirements: string[];
  benefits: string[];
  workArrangement: 'remote' | 'hybrid' | 'on-site';
  accessibility: JobAccessibility;
  applicationUrl: string;
  deadline?: Date;
  source: string;
  sourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedJobListing {
  title: string;
  company: string;
  location: JobLocation;
  salary?: JobSalary;
  description: string;
  requirements: string[];
  benefits: string[];
  workArrangement: 'remote' | 'hybrid' | 'on-site';
  accessibility: JobAccessibility;
  applicationUrl: string;
  deadline?: Date;
  source: string;
  sourceId: string;
}
