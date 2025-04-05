
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface ActivityHeaderProps {
  id: string;
  image: string;
  images?: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
  }>;
  title: string;
  category: string;
  featured: boolean;
}

const ActivityHeader = ({ id, image, images = [], title, category, featured }: ActivityHeaderProps) => {
  const { isLoggedIn, toggleBookmark, isBookmarked } = useUser();
  const bookmarked = isLoggedIn && isBookmarked(id);
  
  // Use images array if available, otherwise fall back to the single image
  const imageArray = images && images.length > 0 
    ? images.map(img => ({ url: img.image_url, alt: img.alt_text || title }))
    : [{ url: image, alt: title }];

  return (
    <div className="mb-6 relative">
      <Carousel className="w-full">
        <CarouselContent>
          {imageArray.map((img, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-96 object-cover rounded-xl shadow-md"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {imageArray.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
          </>
        )}
        
        <span className="absolute top-4 left-4 bg-white/80 text-lb-teal text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium z-10">
          {category}
        </span>
        
        {featured && (
          <span className="absolute top-4 right-16 bg-lb-green text-white text-xs px-3 py-1 rounded-full font-medium z-10">
            Featured
          </span>
        )}
        
        {isLoggedIn && (
          <button 
            onClick={() => toggleBookmark(id)}
            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors z-10"
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <svg
              viewBox="0 0 24 24"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 ${bookmarked ? "text-lb-red" : "text-gray-600"}`}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        )}
      </Carousel>
    </div>
  );
};

export default ActivityHeader;
