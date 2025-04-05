
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const indicatorsRef = useRef<HTMLDivElement>(null);

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

  const scrollIndicators = (direction: 'left' | 'right') => {
    if (indicatorsRef.current) {
      const { current } = indicatorsRef;
      const scrollAmount = 100;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
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
        {activities.map(activity => <div key={activity.id} className="featured-slide w-full h-full flex-shrink-0 relative">
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent shadow-[inset_0_-50px_50px_rgba(0,0,0,0.8)]">
              <div className="absolute bottom-0 left-0 p-6 text-white w-full text-left">
                <span className="inline-block mb-2 bg-kids-green px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-left">{activity.title}</h2>
                <p className="mb-4 max-w-2xl text-sm md:text-base opacity-90 text-left">{activity.description}</p>
                
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
                    ${activity.price}
                  </div>
                </div>
                
                <Link to={`/activity/${activity.id}`}>
                  
                </Link>
              </div>
            </div>
          </div>)}
      </div>

      {/* Navigation Arrows for Slides */}
      <button className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors" onClick={goToPrevious} aria-label="Previous slide">
        <ChevronLeft size={20} className="text-kids-blue" />
      </button>
      
      <button className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors" onClick={goToNext} aria-label="Next slide">
        <ChevronRight size={20} className="text-kids-blue" />
      </button>

      {/* Indicators with navigation controls */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <button 
              className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              onClick={() => scrollIndicators('left')}
              aria-label="Scroll indicators left"
            >
              <ChevronLeft size={16} className="text-kids-blue" />
            </button>
            <button 
              className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              onClick={() => scrollIndicators('right')}
              aria-label="Scroll indicators right"
            >
              <ChevronRight size={16} className="text-kids-blue" />
            </button>
          </div>
        </div>
        
        <div 
          className="flex space-x-2 overflow-x-auto hide-scrollbar" 
          ref={indicatorsRef}
          style={{ scrollBehavior: 'smooth' }}
        >
          {activities.map((_, index) => (
            <button 
              key={index} 
              className={cn(
                "flex-shrink-0 h-3 rounded-full transition-all", 
                currentIndex === index ? "bg-white w-6" : "bg-white/50 w-3 hover:bg-white/70"
              )} 
              onClick={() => goToSlide(index)} 
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>;
};

export default FeaturedCarousel;
