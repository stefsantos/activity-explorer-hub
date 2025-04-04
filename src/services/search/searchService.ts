import { supabase } from '@/integrations/supabase/client';
import { algoliasearch } from 'algoliasearch';

export async function searchActivities(query: string) {
  if (!query || query.trim() === '') {
    return [];
  }

  const appID = "0VD3IX6CVL";
  const apiKey = "88f448d3c91573b20d340caddbedfd85";
  const indexName = "activities_rows(3)";
  const client = algoliasearch(appID, apiKey);

  const { results } = await client.search({
    requests: [
      {
        indexName,
        query: query,
      },
    ],
  });

console.log("LOOK: " + JSON.stringify(results));

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
