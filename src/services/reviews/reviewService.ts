
import { supabase } from '@/integrations/supabase/client';
import { Review } from '../types';

export const fetchReviewsByActivityId = async (activityId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const submitReview = async (review: Omit<Review, 'id' | 'created_at' | 'review_date'>): Promise<Review> => {
  const { data, error } = await supabase
    .from('activity_reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserReview = async (activityId: string, userId: string): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  const { error } = await supabase
    .from('activity_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
};
