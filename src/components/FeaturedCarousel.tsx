
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedCarouselProps {
  activities: any[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  activities
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = activities.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && totalSlides > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, totalSlides]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prevIndex => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Format age range text
  const getAgeRangeText = (activity: any) => {
    if (activity.min_age !== null && activity.max_age !== null) {
      return `${activity.min_age}-${activity.max_age} years`;
    } else if (activity.min_age !== null) {
      return `${activity.min_age}+ years`;
    } else if (activity.max_age !== null) {
      return `Up to ${activity.max_age} years`;
    }
    return "All ages";
  };

  if (activities.length === 0) {
    return <div className="w-full h-[450px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">No featured activities available</p>
      </div>;
  }

  return <div className="relative w-full h-[450px] overflow-hidden rounded-2xl shadow-xl">
      {/* Decorative blobs */}
      <div className="bg-blob bg-kids-pink w-64 h-64 top-[-100px] left-[-50px]"></div>
      <div className="bg-blob bg-kids-blue w-80 h-80 bottom-[-120px] right-[-80px]"></div>
      <div className="bg-blob bg-kids-yellow w-56 h-56 bottom-[-80px] left-[20%]"></div>
      
      <div className="flex transition-transform duration-500 ease-in-out w-full h-full" style={{
      transform: `translateX(-${currentIndex * 100}%)`
    }}>
        {activities.map(activity => <Link key={activity.id} to={`/activity/${activity.id}`} className="featured-slide w-full h-full flex-shrink-0 relative">
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent shadow-[inset_0_-50px_50px_rgba(0,0,0,0.6)]">
              <div className="absolute bottom-0 left-0 p-6 text-white w-full text-left">
                <span className="inline-block mb-2 bg-kids-green px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{activity.title}</h2>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    <MapPin size={12} className="mr-1" />
                    {activity.location ? activity.location.name : "Various locations"}
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    <Users size={12} className="mr-1" />
                    {getAgeRangeText(activity)}
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    ₱{formatPrice(activity.price)}
                  </div>
                </div>
                
                
              </div>
            </div>
          </Link>)}
      </div>

      {/* Navigation Arrows */}
      <button className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10" onClick={goToPrevious} aria-label="Previous slide">
        <ChevronLeft size={20} className="text-kids-blue" />
      </button>
      
      <button className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10" onClick={goToNext} aria-label="Next slide">
        <ChevronRight size={20} className="text-kids-blue" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
        {activities.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full bg-white/50 transition-all",
              currentIndex === index && "w-6 bg-white"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>;
};

export default FeaturedCarousel;
