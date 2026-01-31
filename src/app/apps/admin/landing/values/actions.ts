'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { LandingValue } from '@/types/landing';

export async function getValues(): Promise<LandingValue[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_values')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching values:', error);
    throw new Error(error?.message || 'Failed to fetch values');
  }
}

export async function createValue(value: Omit<LandingValue, 'id' | 'created_at' | 'updated_at'>): Promise<LandingValue> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_values')
      .insert([value])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating value:', error);
    throw new Error(error?.message || 'Failed to create value');
  }
}

export async function updateValue(id: string, value: Partial<LandingValue>): Promise<LandingValue> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_values')
      .update(value)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating value:', error);
    throw new Error(error?.message || 'Failed to update value');
  }
}

export async function deleteValue(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('landing_values')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting value:', error);
    throw new Error(error?.message || 'Failed to delete value');
  }
}
