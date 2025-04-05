
export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
  }>;
  category: string;
  location: {
    id: string;
    name: string;
  } | null;
  min_age: number | null;
  max_age: number | null;
  price: number;
  featured: boolean;
  popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  activity_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  review_date: string;
  user_id?: string; // Added user_id as optional to fix TypeScript errors
}
