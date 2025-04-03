
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
};

export type Category = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  name: string;
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
  { id: "wellness", name: "Wellness" },
];

export const locations: Location[] = [
  { id: "nyc", name: "New York" },
  { id: "la", name: "Los Angeles" },
  { id: "chicago", name: "Chicago" },
  { id: "miami", name: "Miami" },
  { id: "seattle", name: "Seattle" },
  { id: "austin", name: "Austin" },
  { id: "denver", name: "Denver" },
  { id: "portland", name: "Portland" },
  { id: "boston", name: "Boston" },
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
    location: "Denver",
    category: "Outdoors",
    ageRange: "All ages",
    price: 45,
    rating: 4.7,
    featured: true,
    popular: true
  },
  {
    id: "2",
    title: "Urban Pottery Workshop",
    description: "Learn pottery making from professional artists in a creative studio setting.",
    image: "https://images.unsplash.com/photo-1607466713648-91c2646b6f4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "New York",
    category: "Arts & Crafts",
    ageRange: "13-17 years",
    price: 65,
    rating: 4.9,
    featured: true
  },
  {
    id: "3",
    title: "Basketball Camp",
    description: "Improve your skills with coaches from professional leagues.",
    image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    location: "Chicago",
    category: "Sports",
    ageRange: "6-12 years",
    price: 85,
    rating: 4.6,
    popular: true
  },
  {
    id: "4",
    title: "Science Museum Tour",
    description: "Interactive exhibits and educational activities for curious minds.",
    image: "https://images.unsplash.com/photo-1574982370264-3e1b142d2414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Boston",
    category: "Educational",
    ageRange: "All ages",
    price: 20,
    rating: 4.8,
    featured: true,
    popular: true
  },
  {
    id: "5",
    title: "Kids Cooking Class",
    description: "Fun and educational cooking experience for children.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    location: "Austin",
    category: "Cooking",
    ageRange: "6-12 years",
    price: 50,
    rating: 4.9,
    popular: true
  },
  {
    id: "6",
    title: "Guitar Lessons",
    description: "Learn to play guitar from professional musicians.",
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Los Angeles",
    category: "Music",
    ageRange: "13-17 years",
    price: 70,
    rating: 4.7
  },
  {
    id: "7",
    title: "Coding Workshop for Kids",
    description: "Introduction to programming concepts through fun projects.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Seattle",
    category: "Technology",
    ageRange: "6-12 years",
    price: 75,
    rating: 4.8,
    featured: true
  },
  {
    id: "8",
    title: "Family Board Game Night",
    description: "Enjoy a variety of board games with your family and new friends.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80",
    location: "Portland",
    category: "Gaming",
    ageRange: "All ages",
    price: 15,
    rating: 4.5
  },
  {
    id: "9",
    title: "Yoga for Teens",
    description: "Relaxing yoga sessions designed specifically for teenagers.",
    image: "https://images.unsplash.com/photo-1599447292412-5357cbde6c7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Miami",
    category: "Wellness",
    ageRange: "13-17 years",
    price: 30,
    rating: 4.6
  },
  {
    id: "10",
    title: "Nature Photography Walk",
    description: "Learn photography techniques while exploring beautiful natural settings.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    location: "Denver",
    category: "Arts & Crafts",
    ageRange: "18-25 years",
    price: 40,
    rating: 4.7
  },
  {
    id: "11",
    title: "Soccer Training Camp",
    description: "Develop soccer skills with experienced coaches.",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    location: "Chicago",
    category: "Sports",
    ageRange: "6-12 years",
    price: 60,
    rating: 4.8
  },
  {
    id: "12",
    title: "Toddler Music Class",
    description: "Interactive music sessions for toddlers and parents.",
    image: "https://images.unsplash.com/photo-1505561519569-a2da365c54e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Boston",
    category: "Music",
    ageRange: "0-3 years",
    price: 25,
    rating: 4.9
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
    filtered = filtered.filter(
      activity => activity.location.toLowerCase() === locationFilter.toLowerCase()
    );
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
