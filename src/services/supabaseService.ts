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

  const { data: packages, error: packagesError } = await supabase
    .from('activity_packages')
    .select('*')
    .eq('activity_id', id);

  if (packagesError) {
    console.error('Error fetching packages:', packagesError);
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from('activity_reviews')
    .select('*')
    .eq('activity_id', id)
    .order('review_date', { ascending: false });

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  }

  const { data: requirements, error: requirementsError } = await supabase
    .from('activity_requirements')
    .select('*')
    .eq('activity_id', id);

  if (requirementsError) {
    console.error('Error fetching requirements:', requirementsError);
  }

  const { data: expectations, error: expectationsError } = await supabase
    .from('activity_expectations')
    .select('*')
    .eq('activity_id', id);

  if (expectationsError) {
    console.error('Error fetching expectations:', expectationsError);
  }

  let userReview = null;
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user) {
    const { data: userReviewData, error: userReviewError } = await supabase
      .rpc('get_user_review', { 
        user_id_param: session.session.user.id, 
        activity_id_param: id 
      });

    if (!userReviewError && userReviewData && userReviewData.length > 0) {
      userReview = {
        id: userReviewData[0].id,
        rating: userReviewData[0].rating,
        comment: userReviewData[0].comment,
        review_date: userReviewData[0].review_date
      };
    }

    if (userReviewError) {
      console.error('Error fetching user review:', userReviewError);
    }
  }

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
  
  if (existingReviews && existingReviews.length > 0) {
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
    
    if (data && data.length > 0) {
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
