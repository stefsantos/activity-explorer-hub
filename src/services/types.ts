
export interface ActivityDetailType {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  min_age: number | null;
  max_age: number | null;
  duration: string | null;
  group_size: string | null;
  schedule: string | null;
  rating: number | null;
  review_count: number | null;
  price: number;
  location: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  organizer: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  variants: {
    id: string;
    name: string;
    description: string | null;
    price_adjustment: number;
    location: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    } | null;
  }[];
  packages: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    max_participants: number | null;
  }[];
  reviews: {
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    review_date: string;
  }[];
  requirements: {
    id: string;
    description: string;
  }[];
  expectations: {
    id: string;
    description: string;
  }[];
  userReview?: {
    id: string;
    rating: number;
    comment: string | null;
    review_date: string;
  } | null;
}

export interface UserReviewType {
  id: string;
  rating: number;
  comment?: string | null;
  activity_id: string;
}

export interface OrganizerDetailType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  activities: {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
    min_age: number | null;
    max_age: number | null;
    rating: number | null;
    review_count: number | null;
  }[];
}
