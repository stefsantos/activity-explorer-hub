
import { supabase } from "@/integrations/supabase/client";
import { OrganizerDetailType, Activity } from "../types";

export async function fetchOrganizerById(id: string): Promise<OrganizerDetailType | null> {
  const { data: organizer, error: organizerError } = await supabase
    .from('activity_organizers')
    .select('*')
    .eq('id', id)
    .single();

  if (organizerError) {
    console.error('Error fetching organizer:', organizerError);
    return null;
  }

  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select(`
      id,
      title,
      description,
      category,
      image,
      price,
      min_age,
      max_age,
      rating,
      review_count,
      location_id,
      location:activity_locations(id, name, address, latitude, longitude, city)
    `)
    .eq('organizer_id', id);

  if (activitiesError) {
    console.error('Error fetching organizer activities:', activitiesError);
    return {
      ...organizer,
      bio: organizer.description || '',
      logo: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      social_media: {},
      activities: []
    };
  }

  // Format activities to match the Activity type
  const formattedActivities: Activity[] = activities?.map(activity => ({
    ...activity,
    location: activity.location || {
      id: '',
      name: 'Unknown location',
      address: '',
      latitude: 0,
      longitude: 0,
    },
    duration: '',
    group_size: '',
    organizer_id: id
  })) || [];

  return {
    ...organizer,
    bio: organizer.description || '',
    logo: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    social_media: {},
    activities: formattedActivities
  };
}
