'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { LandingContact } from '@/types/landing';

export async function getContacts(): Promise<LandingContact[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_contact')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    throw new Error(error?.message || 'Failed to fetch contacts');
  }
}

export async function createContact(
  contact: Omit<LandingContact, 'id' | 'created_at' | 'updated_at'>
): Promise<LandingContact> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_contact')
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating contact:', error);
    throw new Error(error?.message || 'Failed to create contact');
  }
}

export async function updateContact(id: string, contact: Partial<LandingContact>): Promise<LandingContact> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_contact')
      .update(contact)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating contact:', error);
    throw new Error(error?.message || 'Failed to update contact');
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('landing_contact')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    throw new Error(error?.message || 'Failed to delete contact');
  }
}
