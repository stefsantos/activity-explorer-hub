import { supabase } from "@/integrations/supabase/client";
import { getUserProfile } from "@/contexts/UserContext";

// Function to get a user's review for a specific activity
export async function getUserReview(userId: string, activityId: string) {
  // Use the RPC function to get user reviews
  const { data, error } = await supabase
    .rpc('get_user_review', {
      user_id_param: userId,
      activity_id_param: activityId
    });
  
  if (error) {
    console.error('Error fetching user review:', error);
    return null;
  }
  
  // Format the result for compatibility
  if (data && Array.isArray(data) && data.length > 0) {
    return {
      id: data[0].id,
      rating: data[0].rating,
      comment: data[0].comment,
      review_date: data[0].review_date
    };
  }
  
  return null;
}

export async function submitReview(activityId: string, rating: number, comment?: string): Promise<{ success: boolean; error?: string; reviewId?: string }> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return { success: false, error: 'You must be logged in to submit a review' };
  }

  const userId = session.session.user.id;
  
  // Check if user already has a review for this activity
  const { data: existingReviews, error: checkError } = await supabase
    .rpc('check_user_review', { 
      user_id_param: userId, 
      activity_id_param: activityId 
    });

  if (checkError) {
    console.error('Error checking for existing review:', checkError);
    return { success: false, error: 'Error checking for existing review' };
  }

  let result;
  
  // If user already has a review, update it
  if (existingReviews && Array.isArray(existingReviews) && existingReviews.length > 0) {
    const existingReviewId = existingReviews[0].id;
    
    const { data, error } = await supabase
      .rpc('update_user_review', {
        review_id_param: existingReviewId,
        rating_param: rating,
        comment_param: comment || null
      });
    
    if (error) {
      console.error('Error updating review:', error);
      return { success: false, error: 'Error updating review' };
    }
    
    result = { success: true, reviewId: existingReviewId };
  } else {
    // Otherwise, insert a new review
    const { data, error } = await supabase
      .rpc('insert_user_review', {
        activity_id_param: activityId,
        user_id_param: userId,
        rating_param: rating,
        comment_param: comment || null
      });
    
    if (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: 'Error submitting review' };
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      result = { success: true, reviewId: data[0].id };
    } else {
      result = { success: true };
    }
  }

  return result;
}

export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return { success: false, error: 'You must be logged in to delete a review' };
  }

  const { error } = await supabase
    .rpc('delete_user_review', { review_id_param: reviewId });
  
  if (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Error deleting review' };
  }
  
  return { success: true };
}
