
import { supabase } from "@/integrations/supabase/client";

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
