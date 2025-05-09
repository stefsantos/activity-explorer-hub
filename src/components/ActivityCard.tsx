import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from "@/contexts/UserContext";
import { MapPin, Star, Calendar } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActivityCardProps {
  activity: any;
  size?: 'regular' | 'large';
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  size = 'regular'
}) => {
  const {
    isLoggedIn,
    toggleBookmark,
    isBookmarked
  } = useUser();
  const bookmarked = isBookmarked(activity.id);

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

  return <Link to={`/activity/${activity.id}`} className="activity-card h-full block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <img src={activity.image} alt={activity.title} className="w-full h-48 object-cover" />
          
          <div className="absolute top-3 left-3">
            <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              {activity.category}
            </span>
          </div>
          
          <div className="absolute top-3 right-3">
            <span className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {getAgeRangeText()}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-800 text-lg truncate mb-1">{activity.title}</h3>
          
          {activity.location && <div className="flex items-center text-gray-500 mb-2 text-xs">
              <MapPin size={12} className="mr-1 text-gray-500" />
              <span className="truncate">{activity.location.name || "Various locations"}</span>
            </div>}
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star size={14} className="text-amber-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{activity.rating || "4.9"}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
           {activity.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold">₱{formatPrice(activity.price)}</span>
            <div></div>
          </div>
        </div>
      </div>
    </Link>;
};

export default ActivityCard;
