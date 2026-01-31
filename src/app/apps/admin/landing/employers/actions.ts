'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { LandingEmployer } from '@/types/landing';

export async function getEmployers(): Promise<LandingEmployer[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_employers')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching employers:', error);
    throw new Error(error?.message || 'Failed to fetch employers');
  }
}

export async function createEmployer(employer: Omit<LandingEmployer, 'id' | 'created_at' | 'updated_at'>): Promise<LandingEmployer> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_employers')
      .insert([employer])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating employer:', error);
    throw new Error(error?.message || 'Failed to create employer');
  }
}

export async function updateEmployer(id: string, employer: Partial<LandingEmployer>): Promise<LandingEmployer> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_employers')
      .update(employer)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating employer:', error);
    throw new Error(error?.message || 'Failed to update employer');
  }
}

export async function deleteEmployer(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('landing_employers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting employer:', error);
    throw new Error(error?.message || 'Failed to delete employer');
  }
}
