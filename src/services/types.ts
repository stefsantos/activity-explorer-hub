
export interface ActivityLocation {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration?: string;
  group_size?: string;
  location: ActivityLocation;
  min_age?: number;
  max_age?: number;
  price: number;
  rating?: number;
  featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  organizer_id?: string;
  city?: string;
  organizer?: {
    id: string;
    name: string;
    bio?: string;
    logo?: string;
  };
  [key: string]: any;
}

export interface Review {
  id: string;
  activity_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  review_date: string;
  user_id?: string;
}

export interface ActivityDetailType extends Activity {
  duration: string;
  group_size: string;
  location_id: string;
  price_includes: string[];
  requirements: string[];
  expectations: string[];
  organizer: {
    id: string;
    name: string;
    bio: string;
    logo: string;
  };
}

export interface OrganizerDetailType {
  id: string;
  name: string;
  bio: string;
  logo: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
