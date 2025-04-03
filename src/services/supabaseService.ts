import { supabase } from "@/integrations/supabase/client";

export interface ActivityDetailType {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  min_age: number | null;
  max_age: number | null;
  duration: string | null;
  group_size: string | null;
  schedule: string | null;
  rating: number | null;
  review_count: number | null;
  price: number;
  location: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  organizer: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  variants: {
    id: string;
    name: string;
    description: string | null;
    price_adjustment: number;
    location: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    } | null;
  }[];
  packages: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    max_participants: number | null;
  }[];
  reviews: {
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    review_date: string;
  }[];
  requirements: {
    id: string;
    description: string;
  }[];
  expectations: {
    id: string;
    description: string;
  }[];
  userReview?: {
    id: string;
    rating: number;
    comment: string | null;
    review_date: string;
  } | null;
}

export interface UserReviewType {
  id: string;
  rating: number;
  comment?: string | null;
  activity_id: string;
}

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
  // Fetch the basic activity data with location and organizer
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude),
      organizer:organizer_id(id, name, description)
    `)
    .eq('id', id)
    .single();

  if (activityError) {
    console.error('Error fetching activity:', activityError);
    return null;
  }

  // Fetch variants
  const { data: variants, error: variantsError } = await supabase
    .from('activity_variants')
    .select(`
      *,
      location:location_id(id, name, address, latitude, longitude)
    `)
    .eq('activity_id', id);

  if (variantsError) {
    console.error('Error fetching variants:', variantsError);
  }

  // Fetch packages
  const { data: packages, error: packagesError } = await supabase
    .from('activity_packages')
    .select('*')
    .eq('activity_id', id);

  if (packagesError) {
    console.error('Error fetching packages:', packagesError);
  }

  // Fetch reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', id)
    .order('review_date', { ascending: false });

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  }

  // Fetch requirements
  const { data: requirements, error: requirementsError } = await supabase
    .from('activity_requirements')
    .select('*')
    .eq('activity_id', id);

  if (requirementsError) {
    console.error('Error fetching requirements:', requirementsError);
  }

  // Fetch expectations
  const { data: expectations, error: expectationsError } = await supabase
    .from('activity_expectations')
    .select('*')
    .eq('activity_id', id);

  if (expectationsError) {
    console.error('Error fetching expectations:', expectationsError);
  }

  // Check if the current user has submitted a review
  let userReview = null;
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user) {
    const { data: userReviewData, error: userReviewError } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('activity_id', id)
      .eq('user_id', session.session.user.id)
      .single();

    if (!userReviewError && userReviewData) {
      userReview = {
        id: userReviewData.id,
        rating: userReviewData.rating,
        comment: userReviewData.comment,
        review_date: userReviewData.review_date
      };
    }

    if (userReviewError && userReviewError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching user review:', userReviewError);
    }
  }

  // Combine all data into the ActivityDetail structure
  return {
    ...activity,
    variants: variants || [],
    packages: packages || [],
    reviews: reviews || [],
    requirements: requirements || [],
    expectations: expectations || [],
    userReview
  };
}

export async function searchActivities(query: string) {
  if (!query || query.trim() === '') {
    return [];
  }

  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      location:location_id(id, name, address),
      organizer:organizer_id(id, name)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching activities:', error);
    return [];
  }

  return data;
}

export async function submitReview(activityId: string, rating: number, comment?: string): Promise<{ success: boolean; error?: string; reviewId?: string }> {
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
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // Not a "no rows found" error
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

export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
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
