
import { supabase } from "@/integrations/supabase/client";
import { ActivityDetailType } from "../types";
import { getUserReview } from "../reviews/reviewService";

export async function fetchActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude),
      organizer:organizer_id(id, name, description)
    `);

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return data;
}

export async function fetchFeaturedActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude),
      organizer:organizer_id(id, name, description)
    `)
    .eq('featured', true);

  if (error) {
    console.error('Error fetching featured activities:', error);
    return [];
  }

  return data;
}

export async function fetchPopularActivities(limit = 4) {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude),
      organizer:organizer_id(id, name, description)
    `)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular activities:', error);
    return [];
  }

  return data;
}

export async function fetchActivityById(id: string): Promise<ActivityDetailType | null> {
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user?.id;

  // Fetch the activity
  const { data: activity, error } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude),
      organizer:organizer_id(id, name, description),
      variants:activity_variants(*, location:location_id(id, name, address, latitude, longitude)),
      packages:activity_packages(*),
      requirements:activity_requirements(*),
      expectations:activity_expectations(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching activity:', error);
    return null;
  }

  // Get user's review if logged in
  let userReview = null;
  if (userId) {
    userReview = await getUserReview(userId, id);
  }

  // Fetch activity reviews directly
  const { data: reviewData, error: reviewError } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', id)
    .order('review_date', { ascending: false });
  
  if (reviewError) {
    console.error('Error fetching reviews:', reviewError);
  }

  // Process reviews to ensure proper typing
  let formattedReviews: Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    review_date: string;
  }> = [];
  
  if (reviewData && Array.isArray(reviewData) && reviewData.length > 0) {
    formattedReviews = reviewData.map(review => ({
      id: review.id,
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      comment: review.comment,
      review_date: review.review_date
    }));
  }

  // Return formatted activity data
  return {
    ...activity,
    reviews: formattedReviews,
    userReview: userReview || null
  } as ActivityDetailType;
}

async function fetchActivityVariants(activityId: string) {
  const { data, error } = await supabase
    .from('activity_variants')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude)
    `)
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching variants:', error);
    return [];
  }

  return data;
}

async function fetchActivityPackages(activityId: string) {
  const { data, error } = await supabase
    .from('activity_packages')
    .select('*')
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }

  return data;
}

async function fetchActivityReviews(activityId: string) {
  const { data, error } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', activityId)
    .order('review_date', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data;
}

async function fetchActivityRequirements(activityId: string) {
  const { data, error } = await supabase
    .from('activity_requirements')
    .select('*')
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching requirements:', error);
    return [];
  }

  return data;
}

async function fetchActivityExpectations(activityId: string) {
  const { data, error } = await supabase
    .from('activity_expectations')
    .select('*')
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching expectations:', error);
    return [];
  }

  return data;
}
