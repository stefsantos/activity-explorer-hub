
import React from 'react';
import { useUser } from '@/contexts/UserContext';

interface ActivityHeaderProps {
  id: string;
  image: string;
  title: string;
  category: string;
  featured: boolean;
}

const ActivityHeader = ({ id, image, title, category, featured }: ActivityHeaderProps) => {
  const { isLoggedIn, toggleBookmark, isBookmarked } = useUser();
  const bookmarked = isLoggedIn && isBookmarked(id);

  return (
    <div className="mb-6 relative">
      <img
        src={image}
        alt={title}
        className="w-full h-96 object-cover rounded-xl shadow-md"
      />
      
      <span className="absolute top-4 left-4 bg-white/80 text-kids-teal text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium">
        {category}
      </span>
      
      {featured && (
        <span className="absolute top-4 right-16 bg-kids-green text-white text-xs px-3 py-1 rounded-full font-medium">
          Featured
        </span>
      )}
      
      {isLoggedIn && (
        <button 
          onClick={() => toggleBookmark(id)}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <svg
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 ${bookmarked ? "text-kids-pink" : "text-gray-600"}`}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ActivityHeader;
