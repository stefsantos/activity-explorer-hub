import { supabase } from "@/integrations/supabase/client";
import { getUserProfile } from "@/contexts/UserContext";

// Function to get a user's review for a specific activity
export async function getUserReview(userId: string, activityId: string) {
  // We need to use the RPC function because direct table access doesn't match the types
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
  if (data && data.length > 0) {
    return {
      id: data[0].id,
      rating: data[0].rating,
      comment: data[0].comment,
      review_date: data[0].review_date
    };
  }
  
  return null;
}

// Alternative implementation using RPC functions
export async function submitReviewDirect(
  activityId: string, 
  rating: number, 
  comment?: string
): Promise<{ success: boolean; error?: string; reviewId?: string }> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return { success: false, error: 'You must be logged in to submit a review' };
  }

  const userId = session.session.user.id;
  
  // Check if user has already reviewed this activity
  const { data: existingReview, error: checkError } = await supabase
    .rpc('check_user_review', { 
      user_id_param: userId, 
      activity_id_param: activityId 
    });

  if (checkError) {
    console.error('Error checking for existing review:', checkError);
    return { success: false, error: 'Error checking for existing review' };
  }

  let result;
  
  // If a review already exists, update it
  if (existingReview && existingReview.length > 0) {
    const existingReviewId = existingReview[0].id;
    
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
    // Get user profile for reviewer name
    const userProfile = await getUserProfile();
    const reviewer_name = userProfile?.first_name 
      ? `${userProfile.first_name} ${userProfile.last_name || ''}`
      : 'Anonymous';

    // Otherwise, insert a new review into the activity_reviews table
    const { data, error } = await supabase
      .from('activity_reviews')
      .insert({
        activity_id: activityId,
        reviewer_name,
        rating,
        comment,
        review_date: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: 'Error submitting review' };
    }
    
    if (data && data[0]) {
      result = { success: true, reviewId: data[0].id };
    } else {
      result = { success: true };
    }
  }

  return result;
}

export async function deleteReviewDirect(reviewId: string): Promise<{ success: boolean; error?: string }> {
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
