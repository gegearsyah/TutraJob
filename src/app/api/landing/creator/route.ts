import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = supabaseAdmin;
    
    const { data, error } = await supabase
      .from('landing_creator_profile')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ data: data || null });
  } catch (error: any) {
    console.error('Error fetching creator profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch creator profile' },
      { status: 500 }
    );
  }
}
