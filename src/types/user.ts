/**
 * User Profile Types
 * Based on FEATURE_SPECIFICATION.md
 */

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: Address;
  dateOfBirth: Date;
  nationalId: string; // KTP number
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface ProfessionalInfo {
  resume?: File; // PDF or DOCX
  coverLetter: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
}

export interface AccessibilityInfo {
  disabilityType: string;
  accommodations: string[];
  assistiveTech: string[];
}

export interface UserPreferences {
  preferredSalary: {
    min: number;
    max: number;
  };
  preferredLocation: string[];
  workArrangement: 'remote' | 'hybrid' | 'on-site';
}

export interface UserProfile {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  accessibility: AccessibilityInfo;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
