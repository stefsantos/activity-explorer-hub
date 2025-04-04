
import { supabase } from '@/integrations/supabase/client';
import { Review } from '../types';

export const getReviews = async (activityId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert the data to include user_id with proper type casting
    return (data as unknown as Review[]) || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const submitReview = async (
  activityId: string,
  reviewerName: string,
  rating: number,
  comment: string
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .insert([
        {
          activity_id: activityId,
          reviewer_name: reviewerName,
          rating,
          comment,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Add the missing user_id property with type casting
    return (data as unknown) as Review;
  } catch (error) {
    console.error('Error submitting review:', error);
    return null;
  }
};

export const submitReviewDirect = async (
  activityId: string,
  userId: string,
  reviewerName: string,
  rating: number,
  comment: string
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .insert([
        {
          activity_id: activityId,
          reviewer_name: reviewerName,
          rating,
          comment,
          user_id: userId
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Return with proper type casting
    return (data as unknown) as Review;
  } catch (error) {
    console.error('Error submitting review:', error);
    return null;
  }
};

export const deleteReviewDirect = async (reviewId: string): Promise<boolean> => {
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

export const getReviewById = async (reviewId: string): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) throw error;

    // Add the missing user_id property with type casting
    return (data as unknown) as Review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};
