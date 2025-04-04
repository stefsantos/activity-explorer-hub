
import { supabase } from "@/integrations/supabase/client";
import type { ActivityDetailType } from "@/services/types";

export interface Review {
  id: string;
  activity_id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  review_date: string;
}

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

  return data || [];
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

  return data;
}

// Submit a review for an activity
export async function submitReview(
  activityId: string,
  userId: string,
  reviewerName: string,
  rating: number,
  comment: string
): Promise<Review> {
  // This is a placeholder implementation for mock data
  // In a real application, this would submit the review to an API
  return {
    id: `mock-${Date.now()}`,
    activity_id: activityId,
    user_id: userId,
    reviewer_name: reviewerName,
    rating: rating,
    comment: comment,
    review_date: new Date().toISOString(),
  };
}

// Update an existing review
export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review> {
  // This is a placeholder implementation for mock data
  // In a real application, this would update the review in an API
  return {
    id: reviewId,
    activity_id: "mock-activity-id",
    user_id: "mock-user-id",
    reviewer_name: "Mock User",
    rating: rating,
    comment: comment,
    review_date: new Date().toISOString(),
  };
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real application, this would delete the review from an API
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}

// Wrapper for submitReview that returns a consistent format
export async function submitReviewDirect(
  activityId: string, 
  rating: number, 
  comment?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, you would get these from the user context
    const userId = "mock-user-id";
    const reviewerName = "Mock User";
    
    await submitReview(
      activityId,
      userId,
      reviewerName,
      rating,
      comment || ""
    );
    
    return { success: true };
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
