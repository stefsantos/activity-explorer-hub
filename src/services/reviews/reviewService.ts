import { supabase } from "@/integrations/supabase/client";
import { UserReviewType } from "@/services/types";

export async function getUserReview(userId: string, activityId: string): Promise<UserReviewType | null> {
  // Get the user's review for this activity if it exists
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('activity_id', activityId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No review found
      return null;
    }
    console.error('Error fetching user review:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    rating: data.rating,
    comment: data.comment,
    activity_id: data.activity_id
  };
}

export async function submitReview(
  activityId: string,
  rating: number,
  comment?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return { success: false, error: "You must be logged in to submit a review" };
    }

    // Check if user already has a review
    const { data: existingReview, error: checkError } = await supabase
      .from('activity_reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activityId);

    if (checkError) {
      console.error('Error checking for existing review:', checkError);
      return { success: false, error: checkError.message };
    }

    // If review exists, update it
    if (existingReview && Array.isArray(existingReview) && existingReview.length > 0) {
      const { error: updateError } = await supabase
        .from('activity_reviews')
        .update({
          rating,
          comment,
          review_date: new Date().toISOString()
        })
        .eq('id', existingReview[0].id);

      if (updateError) {
        console.error('Error updating review:', updateError);
        return { success: false, error: updateError.message };
      }
      await updateActivityRatings(activityId);
      return { success: true };
    }

    // Get user profile for reviewer name
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: 'Could not retrieve user information' };
    }

    const reviewerName = profileData?.first_name && profileData?.last_name 
      ? `${profileData.first_name} ${profileData.last_name}` 
      : 'Anonymous User';

    // Otherwise insert new review
    const { error: insertError } = await supabase
      .from('activity_reviews')
      .insert({
        activity_id: activityId,
        user_id: userId,
        rating,
        comment,
        reviewer_name: reviewerName
      });

    if (insertError) {
      console.error('Error inserting review:', insertError);
      return { success: false, error: insertError.message };
    }

    // Update activity average rating and review count
    await updateActivityRatings(activityId);

    return { success: true };
  } catch (e) {
    console.error('Unexpected error in submitReview:', e);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get review to find activity_id before deleting
    const { data: review, error: findError } = await supabase
      .from('activity_reviews')
      .select('activity_id')
      .eq('id', reviewId)
      .single();
      
    if (findError) {
      console.error('Error finding review:', findError);
      return { success: false, error: findError.message };
    }
    
    const activityId = review?.activity_id;
    
    // Delete the review
    const { error } = await supabase
      .from('activity_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return { success: false, error: error.message };
    }
    
    // Update activity ratings if we found an activity ID
    if (activityId) {
      await updateActivityRatings(activityId);
    }

    return { success: true };
  } catch (e) {
    console.error('Unexpected error in deleteReview:', e);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Function to update activity ratings based on reviews
async function updateActivityRatings(activityId: string): Promise<void> {
  try {
    // Get all reviews for this activity
    const { data: reviews, error: reviewsError } = await supabase
      .from('activity_reviews')
      .select('rating')
      .eq('activity_id', activityId);

    if (reviewsError) {
      console.error('Error fetching reviews for rating update:', reviewsError);
      return;
    }

    // Calculate average rating
    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update activity with new rating and count
      const { error: updateError } = await supabase
        .from('activities')
        .update({
          rating: averageRating.toFixed(1),
          review_count: reviews.length
        })
        .eq('id', activityId);

      if (updateError) {
        console.error('Error updating activity ratings:', updateError);
      }
    } else {
      // No reviews, reset rating and count
      const { error: resetError } = await supabase
        .from('activities')
        .update({
          rating: null,
          review_count: 0
        })
        .eq('id', activityId);

      if (resetError) {
        console.error('Error resetting activity ratings:', resetError);
      }
    }
  } catch (error) {
    console.error('Error in updateActivityRatings:', error);
  }
}
