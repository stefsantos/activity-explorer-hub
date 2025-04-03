
import { supabase } from "@/integrations/supabase/client";

export async function checkAndSeedActivities() {
  console.log("Checking if activities need to be seeded...");
  try {
    // Check if we have any activities
    const { data: activitiesCount, error: countError } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error("Error checking activities count:", countError);
      return;
    }

    // If we have activities, no need to seed
    if (activitiesCount && activitiesCount.length > 0) {
      console.log("Activities already exist, no need to seed.");
      return;
    }

    console.log("No activities found. Attempting to seed sample data...");

    // Check if we need to create locations first
    let location_id;
    const { data: locations, error: locationsError } = await supabase
      .from('activity_locations')
      .select('id')
      .limit(1);

    if (locationsError) {
      console.error("Error checking locations:", locationsError);
    }

    if (!locations || locations.length === 0) {
      // Create a sample location first
      const { data: newLocation, error: locationError } = await supabase
        .from('activity_locations')
        .insert({
          name: 'Manila City Center',
          address: '123 Main Street, Manila',
          latitude: 14.5995,
          longitude: 120.9842
        })
        .select('id')
        .single();

      if (locationError) {
        console.error("Error creating sample location:", locationError);
        return;
      }

      location_id = newLocation.id;
      console.log("Created sample location:", location_id);
    } else {
      location_id = locations[0].id;
    }

    // Check if we need to create organizers first
    let organizer_id;
    const { data: organizers, error: organizersError } = await supabase
      .from('activity_organizers')
      .select('id')
      .limit(1);

    if (organizersError) {
      console.error("Error checking organizers:", organizersError);
    }

    if (!organizers || organizers.length === 0) {
      // Create a sample organizer first
      const { data: newOrganizer, error: organizerError } = await supabase
        .from('activity_organizers')
        .insert({
          name: 'Kids Adventure Club',
          description: 'Providing fun and educational experiences for children of all ages.'
        })
        .select('id')
        .single();

      if (organizerError) {
        console.error("Error creating sample organizer:", organizerError);
        return;
      }

      organizer_id = newOrganizer.id;
      console.log("Created sample organizer:", organizer_id);
    } else {
      organizer_id = organizers[0].id;
    }

    // Now create sample activities
    const sampleActivities = [
      {
        title: 'Science Adventure Camp',
        description: 'A week-long camp full of exciting experiments and scientific discoveries.',
        category: 'Science',
        image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        featured: true,
        min_age: 8,
        max_age: 12,
        duration: '5 days',
        group_size: '10-15 kids',
        schedule: 'Monday to Friday, 9am-3pm',
        rating: 4.8,
        review_count: 24,
        price: 2500,
        location_id,
        organizer_id
      },
      {
        title: 'Art & Craft Workshop',
        description: 'Express creativity through various art forms and craft activities.',
        category: 'Arts & Crafts',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1051&q=80',
        featured: true,
        min_age: 5,
        max_age: 10,
        duration: '3 hours',
        group_size: '8-12 kids',
        schedule: 'Saturdays, 10am-1pm',
        rating: 4.6,
        review_count: 18,
        price: 850,
        location_id,
        organizer_id
      },
      {
        title: 'Coding for Kids',
        description: 'Introduction to computer programming through fun games and activities.',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        featured: false,
        min_age: 10,
        max_age: 15,
        duration: '2 hours',
        group_size: '6-8 kids',
        schedule: 'Sundays, 2pm-4pm',
        rating: 4.9,
        review_count: 12,
        price: 1200,
        location_id,
        organizer_id
      },
      {
        title: 'Swimming Lessons',
        description: 'Learn to swim with certified instructors in a safe environment.',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        featured: true,
        min_age: 4,
        max_age: 12,
        duration: '1 hour',
        group_size: '4-6 kids',
        schedule: 'Tuesdays and Thursdays, 4pm-5pm',
        rating: 4.7,
        review_count: 31,
        price: 750,
        location_id,
        organizer_id
      }
    ];

    const { error: activitiesError } = await supabase
      .from('activities')
      .insert(sampleActivities);

    if (activitiesError) {
      console.error("Error seeding activities:", activitiesError);
      return;
    }

    console.log("Successfully seeded sample activities");
  } catch (error) {
    console.error("Error in seed function:", error);
  }
}
