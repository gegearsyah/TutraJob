/**
 * Application Tracking Types
 * Based on FEATURE_SPECIFICATION.md
 */

export type ApplicationStatus =
  | 'applied'
  | 'under-review'
  | 'interview-scheduled'
  | 'offer-received'
  | 'rejected';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  interviewDate?: Date;
  notes?: string;
  confirmationId?: string; // From RPA submission
  rpaUsed: boolean; // Whether RPA was used for application
}

export interface ApplicationTracking {
  application: Application;
  job: {
    title: string;
    company: string;
    location: string;
  };
  statusHistory: ApplicationStatusUpdate[];
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  updatedAt: Date;
  message?: string;
}
