'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { LandingCreatorProfile } from '@/types/landing';

export async function getCreators(): Promise<LandingCreatorProfile[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_creator_profile')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching creators:', error);
    throw new Error(error?.message || 'Failed to fetch creators');
  }
}

export async function createCreator(
  creator: Omit<LandingCreatorProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<LandingCreatorProfile> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_creator_profile')
      .insert([creator])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating creator:', error);
    throw new Error(error?.message || 'Failed to create creator');
  }
}

export async function updateCreator(
  id: string,
  creator: Partial<LandingCreatorProfile>
): Promise<LandingCreatorProfile> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_creator_profile')
      .update(creator)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating creator:', error);
    throw new Error(error?.message || 'Failed to update creator');
  }
}

export async function deleteCreator(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('landing_creator_profile')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting creator:', error);
    throw new Error(error?.message || 'Failed to delete creator');
  }
}
