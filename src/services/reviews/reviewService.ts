
import { supabase } from "@/integrations/supabase/client";
import { Review } from "../types";

export async function fetchActivityReviews(activity_id: string) {
  try {
    const { data, error } = await supabase
      .from("activity_reviews")
      .select("*")
      .eq("activity_id", activity_id);

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return data as Review[];
  } catch (error) {
    console.error("Error in fetchActivityReviews:", error);
    return [];
  }
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('activity_reviews')
    .insert(review)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function updateAverageRating(activityId: string) {
  try {
    const { data, error } = await supabase
      .rpc('update_activity_rating', { activity_id: activityId });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating average rating:', error);
    return { success: false, error };
  }
}

// Add the missing functions
export async function getUserReview(userId: string, activityId: string) {
  try {
    const { data, error } = await supabase
      .from('activity_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user review:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserReview:', error);
    return null;
  }
}

export async function submitReviewDirect(
  activityId: string,
  userId: string,
  reviewerName: string,
  rating: number,
  comment?: string
) {
  try {
    // Check if user already has a review for this activity
    const existingReview = await getUserReview(userId, activityId);
    
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('activity_reviews')
        .update({
          rating,
          comment,
          reviewer_name: reviewerName,
          review_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', existingReview.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating review:', error);
        return { success: false, error };
      }
      
      // Update average rating
      await updateAverageRating(activityId);
      
      return { success: true, data };
    } else {
      // Create new review
      const newReview = {
        activity_id: activityId,
        user_id: userId,
        reviewer_name: reviewerName,
        rating,
        comment,
        review_date: new Date().toISOString().split('T')[0]
      };
      
      const { data, error } = await supabase
        .from('activity_reviews')
        .insert(newReview)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating review:', error);
        return { success: false, error };
      }
      
      // Update average rating
      await updateAverageRating(activityId);
      
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error in submitReviewDirect:', error);
    return { success: false, error };
  }
}

export async function deleteReviewDirect(reviewId: string) {
  try {
    // Get the activity ID before deleting the review
    const { data: reviewData } = await supabase
      .from('activity_reviews')
      .select('activity_id')
      .eq('id', reviewId)
      .single();
    
    if (!reviewData) {
      return { success: false, error: 'Review not found' };
    }
    
    const activityId = reviewData.activity_id;
    
    // Delete the review
    const { error } = await supabase
      .from('activity_reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      console.error('Error deleting review:', error);
      return { success: false, error };
    }
    
    // Update average rating
    await updateAverageRating(activityId);
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteReviewDirect:', error);
    return { success: false, error };
  }
}
