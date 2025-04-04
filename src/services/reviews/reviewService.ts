
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
    return data.map(review => ({
      ...review,
      user_id: review.user_id || undefined
    })) as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getUserReview = async (userId: string, activityId: string): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('activity_id', activityId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }

    return {
      ...data,
      user_id: data.user_id || undefined
    } as Review;
  } catch (error) {
    console.error('Error fetching user review:', error);
    return null;
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
    return {
      ...data,
      user_id: data.user_id || undefined
    } as Review;
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
): Promise<{ success: boolean; error?: string; data?: Review }> => {
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
    return { 
      success: true, 
      data: {
        ...data,
        user_id: data.user_id || undefined
      } as Review 
    };
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return { success: false, error: error.message || 'Failed to submit review' };
  }
};

export const deleteReviewDirect = async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('activity_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message || 'Failed to delete review' };
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
    return {
      ...data,
      user_id: data.user_id || undefined
    } as Review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};
