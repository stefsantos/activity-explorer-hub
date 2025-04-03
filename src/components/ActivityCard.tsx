
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from "@/contexts/UserContext";
import { Bookmark, MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: any;
  size?: 'regular' | 'large';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, size = 'regular' }) => {
  const { isLoggedIn, toggleBookmark, isBookmarked } = useUser();
  const bookmarked = isBookmarked(activity.id);

  // Format age range text
  const getAgeRangeText = () => {
    if (activity.min_age !== null && activity.max_age !== null) {
      return `${activity.min_age}-${activity.max_age} years`;
    } else if (activity.min_age !== null) {
      return `${activity.min_age}+ years`;
    } else if (activity.max_age !== null) {
      return `Up to ${activity.max_age} years`;
    }
    return "All ages";
  };

  return (
    <Link to={`/activity/${activity.id}`} className="block">
      <div className={cn(
        "activity-card group",
        size === 'large' ? 'h-[400px]' : 'h-[320px]'
      )}>
        <div className="relative h-full">
          <img 
            src={activity.image} 
            alt={activity.title} 
            className={cn(
              "object-cover w-full transition-transform duration-300 group-hover:scale-105",
              size === 'large' ? 'h-60' : 'h-48'
            )}
          />
          
          {/* Category tag */}
          <span className="absolute top-2 left-2 bg-white/80 text-kids-teal text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium">
            {activity.category}
          </span>
          
          {/* Featured badge */}
          {activity.featured && (
            <span className="absolute top-2 right-10 bg-kids-green text-white text-xs px-3 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          
          {/* Bookmark button */}
          {isLoggedIn && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(activity.id);
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Bookmark 
                size={18} 
                className={cn(
                  "transition-colors",
                  bookmarked ? "fill-kids-pink text-kids-pink" : "text-gray-500"
                )} 
              />
            </button>
          )}
          
          <div className="p-4">
            <h3 className="font-bold text-gray-800 truncate text-lg">{activity.title}</h3>
            
            <div className="flex items-center text-gray-500 my-1 text-xs">
              <MapPin size={12} className="mr-1 text-kids-blue" />
              <span>{activity.location ? activity.location.name : "Various locations"}</span>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Users size={12} className="mr-1 text-kids-purple" />
                <span>{getAgeRangeText()}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-xs ml-1">{activity.rating || "N/A"}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-kids-teal">${activity.price}</span>
              <span className="bg-kids-orange hover:bg-kids-orange/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                Book Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;
