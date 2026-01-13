/**
 * API Route: Job Description Summarization
 * Uses OpenAI to generate audio-friendly summaries of job descriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

interface SummarizeRequest {
  jobDescription: string;
  title?: string;
  company?: string;
}

interface SummarizeResponse {
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

export async function POST(request: NextRequest) {
  try {
    const apiKey = getEnv('OPENAI_API_KEY');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          summary: null,
          structured: null
        },
        { status: 500 }
      );
    }

    const body: SummarizeRequest = await request.json();
    const { jobDescription, title, company } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const prompt = `Anda adalah asisten yang membantu mengekstrak informasi dari deskripsi pekerjaan dalam Bahasa Indonesia. Ekstrak informasi berikut:

1. Judul Pekerjaan (jika tidak disebutkan, gunakan: "${title || 'Pekerjaan'}")
2. Nama Perusahaan (jika tidak disebutkan, gunakan: "${company || 'Perusahaan'}")
3. Rentang Gaji (jika disebutkan, dalam Rupiah)
4. Lokasi dengan aksesibilitas transportasi umum (jarak ke TransJakarta jika disebutkan)
5. Tingkat dukungan disabilitas (Tinggi/Sedang/Rendah) dan akomodasi yang tersedia

Format output sebagai ringkasan audio-friendly dalam Bahasa Indonesia, maksimal 150 kata. Fokus pada informasi yang relevan untuk pengguna tunanetra.

Deskripsi pekerjaan:
${jobDescription}

Format output sebagai JSON dengan struktur:
{
  "summary": "ringkasan audio-friendly dalam Bahasa Indonesia",
  "title": "judul pekerjaan",
  "company": "nama perusahaan",
  "salary": {
    "min": angka_minimal_atau_null,
    "max": angka_maksimal_atau_null,
    "currency": "IDR"
  },
  "location": {
    "address": "alamat lengkap atau null",
    "district": "kecamatan/daerah atau null",
    "transjakartaDistance": angka_dalam_meter_atau_null,
    "accessibility": "deskripsi aksesibilitas atau null"
  },
  "supportLevel": "high|medium|low atau null",
  "accommodations": ["daftar", "akomodasi", "atau", "array kosong"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cheaper model for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'Anda adalah asisten yang ahli dalam mengekstrak informasi dari deskripsi pekerjaan dan memformatnya untuk aksesibilitas audio. Selalu kembalikan respons dalam format JSON yang valid.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent extraction
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to generate summary',
          summary: null,
          structured: null
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from OpenAI' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback: create a simple summary
      parsedData = {
        summary: `Posisi: ${title || 'Pekerjaan'} di ${company || 'Perusahaan'}. ${jobDescription.substring(0, 100)}...`,
        title: title || 'Pekerjaan',
        company: company || 'Perusahaan',
        salary: null,
        location: null,
        supportLevel: null,
        accommodations: [],
      };
    }

    const result: SummarizeResponse = {
      summary: parsedData.summary || `Posisi: ${parsedData.title || title} di ${parsedData.company || company}.`,
      structured: {
        title: parsedData.title || title || 'Pekerjaan',
        company: parsedData.company || company || 'Perusahaan',
        salary: parsedData.salary || undefined,
        location: parsedData.location || undefined,
        supportLevel: parsedData.supportLevel || undefined,
        accommodations: parsedData.accommodations || [],
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in summarize route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: null,
        structured: null
      },
      { status: 500 }
    );
  }
}
