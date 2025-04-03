
import { supabase } from "@/integrations/supabase/client";
import { OrganizerDetailType } from "../types";

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
      review_count
    `)
    .eq('organizer_id', id);

  if (activitiesError) {
    console.error('Error fetching organizer activities:', activitiesError);
    return {
      ...organizer,
      activities: []
    };
  }

  return {
    ...organizer,
    activities: activities || []
  };
}
