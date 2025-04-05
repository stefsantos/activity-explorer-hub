
export type Activity = {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  category: string;
  ageRange: string;
  price: number;
  rating: number;
  bookmarked?: boolean;
  featured?: boolean;
  popular?: boolean;
  city?: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  city?: string;
};

export type AgeRange = {
  id: string;
  name: string;
};

export const categories: Category[] = [
  { id: "outdoors", name: "Outdoors" },
  { id: "arts", name: "Arts & Crafts" },
  { id: "sports", name: "Sports" },
  { id: "educational", name: "Educational" },
  { id: "cooking", name: "Cooking" },
  { id: "music", name: "Music" },
  { id: "technology", name: "Technology" },
  { id: "gaming", name: "Gaming" },
  { id: "entertainment", name: "Entertainment" },
];

export const locations: Location[] = [
  { id: "caloocan", name: "Caloocan City Center", latitude: 14.6500, longitude: 120.9833, city: "Caloocan" },
  { id: "las_pinas", name: "Las Piñas Plaza", latitude: 14.4500, longitude: 120.9833, city: "Las Piñas" },
  { id: "makati", name: "Makati CBD", latitude: 14.5547, longitude: 121.0244, city: "Makati" },
  { id: "malabon", name: "Malabon City Hall", latitude: 14.6625, longitude: 120.9592, city: "Malabon" },
  { id: "mandaluyong", name: "Mandaluyong City Center", latitude: 14.5833, longitude: 121.0333, city: "Mandaluyong" },
  { id: "manila", name: "Manila Central", latitude: 14.5995, longitude: 120.9842, city: "Manila" },
  { id: "marikina", name: "Marikina City Center", latitude: 14.6500, longitude: 121.1000, city: "Marikina" },
  { id: "muntinlupa", name: "Muntinlupa Central", latitude: 14.4167, longitude: 121.0417, city: "Muntinlupa" },
  { id: "navotas", name: "Navotas City Hall", latitude: 14.6667, longitude: 120.9417, city: "Navotas" },
  { id: "paranaque", name: "Parañaque City Center", latitude: 14.4667, longitude: 121.0167, city: "Parañaque" },
  { id: "pasay", name: "Pasay City Center", latitude: 14.5500, longitude: 121.0000, city: "Pasay" },
  { id: "pasig", name: "Pasig City Hall", latitude: 14.5764, longitude: 121.0851, city: "Pasig" },
  { id: "quezon", name: "Quezon City Circle", latitude: 14.6760, longitude: 121.0437, city: "Quezon City" },
  { id: "san_juan", name: "San Juan City Center", latitude: 14.6000, longitude: 121.0333, city: "San Juan" },
  { id: "taguig", name: "BGC Taguig", latitude: 14.5176, longitude: 121.0509, city: "Taguig" },
  { id: "valenzuela", name: "Valenzuela City Hall", latitude: 14.7014, longitude: 120.9597, city: "Valenzuela" },
  { id: "cebu", name: "Cebu City Center", latitude: 10.3157, longitude: 123.8854, city: "Cebu" },
  { id: "davao", name: "Davao City Plaza", latitude: 7.1907, longitude: 125.4553, city: "Davao" },
];

export const ageRanges: AgeRange[] = [
  { id: "toddler", name: "0-3 years" },
  { id: "preschool", name: "3-5 years" },
  { id: "children", name: "6-12 years" },
  { id: "teens", name: "13-17 years" },
  { id: "youngAdults", name: "18-25 years" },
  { id: "adults", name: "25+ years" },
  { id: "family", name: "All ages" },
];

export const activities: Activity[] = [
  {
    id: "1",
    title: "Mountain Hiking Adventure",
    description: "Experience breathtaking views on this guided mountain hike.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Cebu City Center",
    category: "Outdoors",
    ageRange: "All ages",
    price: 45,
    rating: 4.7,
    featured: true,
    popular: true,
    city: "Cebu"
  },
  {
    id: "2",
    title: "Urban Pottery Workshop",
    description: "Learn pottery making from professional artists in a creative studio setting.",
    image: "https://images.unsplash.com/photo-1607466713648-91c2646b6f4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "BGC Taguig",
    category: "Arts & Crafts",
    ageRange: "13-17 years",
    price: 65,
    rating: 4.9,
    featured: true,
    city: "Taguig"
  },
  {
    id: "3",
    title: "Basketball Camp",
    description: "Improve your skills with coaches from professional leagues.",
    image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    location: "Quezon City Circle",
    category: "Sports",
    ageRange: "6-12 years",
    price: 85,
    rating: 4.6,
    popular: true,
    city: "Quezon City"
  },
  {
    id: "4",
    title: "Science Museum Tour",
    description: "Interactive exhibits and educational activities for curious minds.",
    image: "https://images.unsplash.com/photo-1574982370264-3e1b142d2414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Manila Central",
    category: "Educational",
    ageRange: "All ages",
    price: 20,
    rating: 4.8,
    featured: true,
    popular: true,
    city: "Manila"
  },
  {
    id: "5",
    title: "Kids Cooking Class",
    description: "Fun and educational cooking experience for children.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    location: "Pasig City Hall",
    category: "Cooking",
    ageRange: "6-12 years",
    price: 50,
    rating: 4.9,
    popular: true,
    city: "Pasig"
  },
  {
    id: "6",
    title: "Guitar Lessons",
    description: "Learn to play guitar from professional musicians.",
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Makati CBD",
    category: "Music",
    ageRange: "13-17 years",
    price: 70,
    rating: 4.7,
    city: "Makati"
  },
  {
    id: "7",
    title: "Coding Workshop for Kids",
    description: "Introduction to programming concepts through fun projects.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Davao City Plaza",
    category: "Technology",
    ageRange: "6-12 years",
    price: 75,
    rating: 4.8,
    featured: true,
    city: "Davao"
  },
  {
    id: "8",
    title: "Family Board Game Night",
    description: "Enjoy a variety of board games with your family and new friends.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80",
    location: "Las Piñas Plaza",
    category: "Gaming",
    ageRange: "All ages",
    price: 15,
    rating: 4.5,
    city: "Las Piñas"
  },
  {
    id: "9",
    title: "Yoga for Teens",
    description: "Relaxing yoga sessions designed specifically for teenagers.",
    image: "https://images.unsplash.com/photo-1599447292412-5357cbde6c7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Parañaque City Center",
    category: "Entertainment",
    ageRange: "13-17 years",
    price: 30,
    rating: 4.6,
    city: "Parañaque"
  },
  {
    id: "10",
    title: "Nature Photography Walk",
    description: "Learn photography techniques while exploring beautiful natural settings.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    location: "Marikina City Center",
    category: "Arts & Crafts",
    ageRange: "18-25 years",
    price: 40,
    rating: 4.7,
    city: "Marikina"
  },
  {
    id: "11",
    title: "Soccer Training Camp",
    description: "Develop soccer skills with experienced coaches.",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    location: "San Juan City Center",
    category: "Sports",
    ageRange: "6-12 years",
    price: 60,
    rating: 4.8,
    city: "San Juan"
  },
  {
    id: "12",
    title: "Toddler Music Class",
    description: "Interactive music sessions for toddlers and parents.",
    image: "https://images.unsplash.com/photo-1505561519569-a2da365c54e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Muntinlupa Central",
    category: "Music",
    ageRange: "0-3 years",
    price: 25,
    rating: 4.9,
    city: "Muntinlupa"
  }
];

export const getFeaturedActivities = (): Activity[] => {
  return activities.filter(activity => activity.featured === true);
};

export const getPopularActivities = (): Activity[] => {
  return activities.filter(activity => activity.popular === true);
};

export const filterActivities = (
  categoryFilter?: string,
  locationFilter?: string,
  ageRangeFilter?: string,
  page: number = 1,
  limit: number = 6
): { activities: Activity[]; totalPages: number } => {
  let filtered = [...activities];

  if (categoryFilter && categoryFilter !== "all") {
    filtered = filtered.filter(
      activity => activity.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (locationFilter && locationFilter !== "all") {
    if (locationFilter.startsWith('city-')) {
      const targetCity = locationFilter.replace('city-', '');
      
      filtered = filtered.filter(activity => {
        // Use the city field directly from the activity
        return activity.city === targetCity;
      });
    } else {
      const targetLocation = locations.find(loc => loc.id === locationFilter);
      
      if (targetLocation) {
        const maxDistanceKm = 5;
        
        filtered = filtered.filter(activity => {
          const activityLoc = typeof activity.location === 'string' 
            ? locations.find(l => l.name === activity.location)
            : null;
            
          if (!activityLoc) return false;
          
          const distance = calculateDistance(
            targetLocation.latitude, 
            targetLocation.longitude,
            activityLoc.latitude,
            activityLoc.longitude
          );
          
          return distance <= maxDistanceKm;
        });
      }
    }
  }

  if (ageRangeFilter && ageRangeFilter !== "all") {
    filtered = filtered.filter(
      activity => activity.ageRange.toLowerCase() === ageRangeFilter.toLowerCase()
    );
  }

  const totalPages = Math.ceil(filtered.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedActivities = filtered.slice(startIndex, startIndex + limit);

  return {
    activities: paginatedActivities,
    totalPages
  };
};

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}
