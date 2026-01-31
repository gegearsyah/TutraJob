import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'info' or 'testimonial'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    let query = supabase
      .from('landing_articles')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching landing articles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch landing articles' },
      { status: 500 }
    );
  }
}
