'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { LandingArticle } from '@/types/landing';

export async function getArticles(): Promise<LandingArticle[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_articles')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    throw new Error(error?.message || 'Failed to fetch articles');
  }
}

export async function createArticle(article: Omit<LandingArticle, 'id' | 'created_at' | 'updated_at'>): Promise<LandingArticle> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating article:', error);
    throw new Error(error?.message || 'Failed to create article');
  }
}

export async function updateArticle(id: string, article: Partial<LandingArticle>): Promise<LandingArticle> {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_articles')
      .update(article)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating article:', error);
    throw new Error(error?.message || 'Failed to update article');
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('landing_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting article:', error);
    throw new Error(error?.message || 'Failed to delete article');
  }
}
