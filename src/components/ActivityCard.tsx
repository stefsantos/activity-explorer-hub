
import React from 'react';
import { Activity } from "@/data/activities";
import { useUser } from "@/contexts/UserContext";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  size?: 'regular' | 'large';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, size = 'regular' }) => {
  const { isLoggedIn, toggleBookmark, isBookmarked } = useUser();
  const bookmarked = isBookmarked(activity.id);

  return (
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
        
        {isLoggedIn && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(activity.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Bookmark 
              size={18} 
              className={cn(
                "transition-colors",
                bookmarked ? "fill-brand-500 text-brand-500" : "text-gray-500"
              )} 
            />
          </button>
        )}
        
        <div className="p-4">
          <h3 className="font-bold text-gray-800 truncate">{activity.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{activity.location}</p>
          <div className="flex justify-between items-center">
            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">
              {activity.category}
            </span>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">${activity.price}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{activity.ageRange}</span>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-xs ml-1">{activity.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
