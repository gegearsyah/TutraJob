import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

interface NarrateRequest {
  title?: string;
  subtitle?: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getEnv('OPENAI_API_KEY');

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const body: NarrateRequest = await request.json();
    const { title, subtitle, description } = body;

    const prompt = `Anda adalah copywriter yang menulis narasi hero landing page yang persuasif dan ringkas dalam Bahasa Indonesia (maksimal 40 kata). Buat versi audio-friendly yang jelas dan cocok untuk dibacakan oleh narrator. Sertakan call-to-action singkat pada akhir.\n\nJudul: ${title || ''}\nSubjudul: ${subtitle || ''}\nDeskripsi: ${description || ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getEnv('OPENAI_MODEL') || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful copywriter creating short, punchy Indonesian marketing lines.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error (narrate):', errText);
      return NextResponse.json({ error: 'Failed to generate narration' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content received from OpenAI' }, { status: 500 });
    }

    // Return narration text
    return NextResponse.json({ narration: content });
  } catch (error) {
    console.error('Error generating narration:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
