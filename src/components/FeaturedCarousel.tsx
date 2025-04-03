
import React, { useState, useEffect } from 'react';
import { Activity } from "@/data/activities";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedCarouselProps {
  activities: Activity[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ activities }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = activities.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, totalSlides]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      <div 
        className="flex transition-transform duration-500 ease-in-out w-full h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activities.map((activity) => (
          <div key={activity.id} className="featured-slide w-full h-full flex-shrink-0 relative">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{activity.title}</h2>
                <p className="mb-4 max-w-2xl text-sm md:text-base">{activity.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-brand-500 px-3 py-1 rounded-full text-xs md:text-sm">
                    {activity.location}
                  </span>
                  <span className="bg-brand-600 px-3 py-1 rounded-full text-xs md:text-sm">
                    {activity.category}
                  </span>
                  <span className="bg-brand-700 px-3 py-1 rounded-full text-xs md:text-sm">
                    ${activity.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {activities.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-white w-4" : "bg-white/50"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
