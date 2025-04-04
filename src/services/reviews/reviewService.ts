
import { supabase } from '@/integrations/supabase/client';
import { ActivityReview } from '@/services/types';

export const getReviews = async (activityId: string): Promise<ActivityReview[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('activity_id', activityId)
      .order('review_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getUserReview = async (activityId: string, userId: string): Promise<ActivityReview | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('activity_id', activityId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "no rows returned" error
    
    return data || null;
  } catch (error) {
    console.error('Error fetching user review:', error);
    return null;
  }
};

export const submitReview = async (
  activityId: string,
  reviewerName: string,
  rating: number,
  comment: string,
  userId?: string
): Promise<ActivityReview | null> => {
  try {
    const reviewData = {
      activity_id: activityId,
      reviewer_name: reviewerName,
      rating,
      comment,
      user_id: userId
    };

    const { data, error } = await supabase
      .from('activity_reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    return null;
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: {
    rating?: number;
    comment?: string;
  }
): Promise<ActivityReview | null> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .update(reviewData)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    return null;
  }
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('activity_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};
