
import { supabase } from "@/integrations/supabase/client";
import { ActivityDetailType } from "../types";

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

  // Fetch related data using separate functions
  const variants = await fetchActivityVariants(id);
  const packages = await fetchActivityPackages(id);
  const reviews = await fetchActivityReviews(id);
  const requirements = await fetchActivityRequirements(id);
  const expectations = await fetchActivityExpectations(id);
  
  // Get user review if user is logged in
  let userReview = null;
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user) {
    const { data: userReviewData, error: userReviewError } = await supabase
      .rpc('get_user_review', { 
        user_id_param: session.session.user.id, 
        activity_id_param: id 
      });

    if (!userReviewError && userReviewData && Array.isArray(userReviewData) && userReviewData.length > 0) {
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

// Helper functions to fetch related data
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
