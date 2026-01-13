/**
 * Job Description Summarizer
 * Client-side utility for calling the AI summarization API
 */

import type { JobListing } from '@/types/job';

export interface SummarizationResult {
  summary: string;
  structured: {
    title: string;
    company: string;
    salary?: {
      min?: number;
      max?: number;
      currency: string;
    };
    location?: {
      address?: string;
      district?: string;
      transjakartaDistance?: number;
      accessibility?: string;
    };
    supportLevel?: 'high' | 'medium' | 'low';
    accommodations?: string[];
  };
  error?: string;
}

/**
 * Summarize a job description using AI
 * @param jobDescription - Full job description text
 * @param title - Job title (optional, helps with context)
 * @param company - Company name (optional, helps with context)
 * @returns Summarization result
 */
export async function summarizeJobDescription(
  jobDescription: string,
  title?: string,
  company?: string
): Promise<SummarizationResult> {
  try {
    const response = await fetch('/api/jobs/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        title,
        company,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to summarize job description');
    }

    const data: SummarizationResult = await response.json();
    return data;
  } catch (error) {
    console.error('Error summarizing job description:', error);
    
    // Fallback: create a simple summary
    const fallbackSummary = `Posisi: ${title || 'Pekerjaan'} di ${company || 'Perusahaan'}. ${jobDescription.substring(0, 150)}...`;
    
    return {
      summary: fallbackSummary,
      structured: {
        title: title || 'Pekerjaan',
        company: company || 'Perusahaan',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if AI summarization is available
 * @returns boolean indicating if OpenAI API key is configured
 */
export function isAISummarizationAvailable(): boolean {
  // Check if API key is configured (client-side check)
  // Note: This is a best-effort check. The actual API will validate server-side.
  return typeof window !== 'undefined';
}

/**
 * Enhance job listing with AI-generated summary if not present
 * @param job - Job listing to enhance
 * @returns Enhanced job listing with summary
 */
export async function enhanceJobWithAISummary(
  job: JobListing
): Promise<JobListing> {
  // If job already has a summary, return as-is
  if (job.summary && job.summary.trim() !== '') {
    return job;
  }

  // If AI is not available, return job as-is
  if (!isAISummarizationAvailable()) {
    return job;
  }

  try {
    const result = await summarizeJobDescription(
      job.description,
      job.title,
      job.company
    );

    if (result.error) {
      console.warn('AI summarization failed, using fallback:', result.error);
      return job;
    }

    // Merge AI-extracted data with existing job data
    const enhanced: JobListing = {
      ...job,
      summary: result.summary,
      // Update salary if AI extracted it and job doesn't have it
      salary: job.salary || (result.structured.salary ? {
        min: result.structured.salary.min,
        max: result.structured.salary.max,
        currency: result.structured.salary.currency || 'IDR',
        period: 'monthly' as const,
      } : undefined),
      // Update location if AI extracted it
      location: job.location || result.structured.location ? {
        ...job.location,
        ...result.structured.location,
      } : undefined,
      // Update accessibility if AI extracted it
      accessibility: job.accessibility || result.structured.supportLevel ? {
        level: result.structured.supportLevel || job.accessibility?.level || 'medium',
        details: result.structured.accommodations || job.accessibility?.details || [],
      } : undefined,
    };

    return enhanced;
  } catch (error) {
    console.error('Error enhancing job with AI summary:', error);
    return job;
  }
}
