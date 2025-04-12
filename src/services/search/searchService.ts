
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
