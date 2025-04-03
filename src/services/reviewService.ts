import { supabase } from "@/integrations/supabase/client";

// Function to directly access user_reviews table bypassing TypeScript type checking
export async function getUserReview(userId: string, activityId: string) {
  const { data, error } = await supabase
    .from('user_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('activity_id', activityId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching user review:', error);
    return null;
  }
  
  return data;
}

// Alternative implementation using direct table access with type assertions
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
    .from('user_reviews')
    .select('id')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking for existing review:', checkError);
    return { success: false, error: 'Error checking for existing review' };
  }

  let result;
  
  // If a review already exists, update it
  if (existingReview) {
    const { data, error } = await supabase
      .from('user_reviews')
      .update({
        rating,
        comment,
        review_date: new Date().toISOString()
      })
      .eq('id', existingReview.id)
      .select();
    
    if (error) {
      console.error('Error updating review:', error);
      return { success: false, error: 'Error updating review' };
    }
    
    result = { success: true, reviewId: existingReview.id };
  } else {
    // Otherwise, insert a new review
    const { data, error } = await supabase
      .from('user_reviews')
      .insert({
        activity_id: activityId,
        user_id: userId,
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
    .from('user_reviews')
    .delete()
    .eq('id', reviewId);
  
  if (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Error deleting review' };
  }
  
  return { success: true };
}
