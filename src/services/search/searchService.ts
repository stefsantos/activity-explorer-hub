
import { supabase } from '@/integrations/supabase/client';

export const fetchCities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_locations')
      .select('city')
      .not('city', 'is', null);

    if (error) throw error;
    
    // Extract unique cities from results
    const cities = data
      .map(item => item.city)
      .filter((city): city is string => city !== null && city !== undefined)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
      
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Add the searchActivities function to search for activities by query string
export const searchActivities = async (query: string) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const { data, error } = await supabase
      .from('activities')
      .select(`
        id,
        title,
        image,
        category,
        location:activity_locations(name)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(10);
    
    if (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchActivities:', error);
    return [];
  }
};
