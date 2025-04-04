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

  // Extracting hits from the first result (since results is an array with one object)
  const hits = results[0]?.hits || [];

  console.log("Search Hits:", hits);  // Logs the hits array to the console

  return hits;
}
