
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
