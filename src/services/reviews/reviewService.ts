
import { supabase } from "@/integrations/supabase/client";
import type { Review } from "@/services/types";

// Get all reviews for an activity
export async function getReviewsByActivityId(activityId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data as unknown as Review[] || [];
}

// Get a specific user's review for an activity
export async function getUserReview(userId: string, activityId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found error
      console.error('Error fetching user review:', error);
    }
    return null;
  }

  return data as unknown as Review;
}

// Submit a review for an activity
export async function submitReview(
  activityId: string,
  userId: string,
  reviewerName: string,
  rating: number,
  comment: string
): Promise<Review | null> {
  try {
    const existingReview = await getUserReview(userId, activityId);
    
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('activity_reviews')
        .update({
          rating,
          comment,
          review_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', existingReview.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating review:', error);
        return null;
      }
      
      return data as unknown as Review;
    } else {
      // Insert new review
      const { data, error } = await supabase
        .from('activity_reviews')
        .insert({
          activity_id: activityId,
          user_id: userId,
          reviewer_name: reviewerName,
          rating,
          comment,
          review_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error submitting review:', error);
        return null;
      }
      
      return data as unknown as Review;
    }
  } catch (error) {
    console.error('Error in submitReview:', error);
    return null;
  }
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('activity_reviews')
      .delete()
      .eq('id', reviewId);
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}

// Wrapper for submitReview that returns a consistent format
export async function submitReviewDirect(
  activityId: string, 
  userId: string,
  reviewerName: string,
  rating: number, 
  comment?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await submitReview(
      activityId,
      userId,
      reviewerName,
      rating,
      comment || ""
    );
    
    if (result) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to submit review' };
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}

// Wrapper for deleteReview
export async function deleteReviewDirect(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  return deleteReview(reviewId);
}
