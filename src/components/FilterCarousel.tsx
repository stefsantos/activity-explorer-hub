
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterCarouselProps {
  title: string;
  options: FilterOption[];
  selectedOption: string;
  onChange: (id: string) => void;
}

const FilterCarousel: React.FC<FilterCarouselProps> = ({
  title,
  options,
  selectedOption,
  onChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        className="relative flex overflow-x-auto pb-4 filter-scroll" 
        ref={scrollRef}
      >
        <Button
          variant={selectedOption === 'all' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "flex-shrink-0 mr-2 rounded-full px-4",
            selectedOption === 'all' 
              ? 'bg-kids-teal text-white hover:bg-kids-teal/90' 
              : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white'
          )}
          onClick={() => onChange('all')}
        >
          All
        </Button>
        
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "flex-shrink-0 mr-2 whitespace-nowrap rounded-full px-4",
              selectedOption === option.id 
                ? 'bg-kids-teal text-white hover:bg-kids-teal/90' 
                : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white'
            )}
            onClick={() => onChange(option.id)}
          >
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterCarousel;
