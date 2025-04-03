
import { supabase } from "@/integrations/supabase/client";

export interface ActivityDetail {
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

export async function fetchActivityById(id: string): Promise<ActivityDetail | null> {
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

  // Combine all data into the ActivityDetail structure
  return {
    ...activity,
    variants: variants || [],
    packages: packages || [],
    reviews: reviews || [],
    requirements: requirements || [],
    expectations: expectations || [],
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
