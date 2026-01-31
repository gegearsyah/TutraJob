import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = supabaseAdmin;
    
    const { data, error } = await supabase
      .from('landing_values')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching landing values:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch landing values' },
      { status: 500 }
    );
  }
}
