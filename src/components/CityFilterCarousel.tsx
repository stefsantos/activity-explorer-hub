import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CityOption {
  id: string;
  name: string;
}
interface CityFilterCarouselProps {
  title?: string;
  cities: CityOption[];
  selectedCity: string;
  onChange: (id: string) => void;
}
const CityFilterCarousel: React.FC<CityFilterCarouselProps> = ({
  title = "Cities",
  cities,
  selectedCity,
  onChange
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const {
        current
      } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      } else {
        current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };
  return <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <MapPin size={18} className="mr-1" />
          {title}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white" onClick={() => scroll('left')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white" onClick={() => scroll('right')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center w-full">
        <div ref={scrollRef} className="relative flex overflow-x-auto pb-1 filter-scroll w-full">
          <div className="flex space-x-2">
            <Button variant={selectedCity === 'all' ? 'default' : 'outline'} size="sm" className={cn("flex-shrink-0 rounded-full px-4", selectedCity === 'all' ? 'bg-kids-teal text-white hover:bg-kids-teal/90' : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white')} onClick={() => onChange('all')}>
              All Cities
            </Button>
            
            {cities.map(city => <Button key={city.id} variant={selectedCity === `city-${city.name}` ? 'default' : 'outline'} size="sm" className={cn("flex-shrink-0 whitespace-nowrap rounded-full px-4", selectedCity === `city-${city.name}` ? 'bg-kids-teal text-white hover:bg-kids-teal/90' : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white')} onClick={() => onChange(`city-${city.name}`)}>
                {city.name}
              </Button>)}
          </div>
        </div>
      </div>
    </div>;
};
export default CityFilterCarousel;