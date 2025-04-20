import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Baby, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterCarouselProps {
  title: string;
  options: FilterOption[];
  selectedOption: string;
  onChange: (id: string) => void;
  isAgeFilter?: boolean;
  ageRange?: [number, number];
  onAgeRangeChange?: (value: [number, number]) => void;
}

const FilterCarousel: React.FC<FilterCarouselProps> = ({
  title,
  options,
  selectedOption,
  onChange,
  isAgeFilter = false,
  ageRange = [0, 16],
  onAgeRangeChange
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ageButtonsRef = useRef<HTMLDivElement>(null);

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

  const scrollAgeButtons = (direction: 'left' | 'right') => {
    if (ageButtonsRef.current) {
      const { current } = ageButtonsRef;
      const scrollAmount = 100;
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

  // Common age ranges
  const ageRangePresets = [{
    label: "All Ages",
    range: [0, 16],
    icon: <Users size={16} />
  }, {
    label: "0-3",
    range: [0, 3],
    icon: <Baby size={16} />
  }, {
    label: "4-7",
    range: [4, 7],
    icon: <User size={16} />
  }, {
    label: "8-12",
    range: [8, 12],
    icon: <User size={16} />
  }, {
    label: "13+",
    range: [13, 16],
    icon: <Users size={16} />
  }];

  return <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white" onClick={() => scroll('left')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-kids-blue text-kids-blue hover:bg-kids-blue hover:text-white" onClick={() => scroll('right')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isAgeFilter && onAgeRangeChange ? <div className="py-2 px-0">
          {/* Age range preset buttons - scrollable on mobile */}
          <div className="mb-4 relative">
            <div ref={scrollRef} className="relative flex overflow-x-auto pb-1 filter-scroll w-full">
              <div className="flex gap-2 min-w-max">
                {ageRangePresets.map(preset => <Button 
                  key={preset.label} 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "rounded-full border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white flex items-center gap-1 whitespace-nowrap", 
                    ageRange[0] === preset.range[0] && ageRange[1] === preset.range[1] ? 'bg-kids-teal text-white' : ''
                  )} 
                  onClick={() => onAgeRangeChange(preset.range as [number, number])}
                >
                  {preset.icon}
                  {preset.label}
                </Button>)}
              </div>
            </div>
           
          </div>
          
          <Slider 
            value={ageRange} 
            min={0} 
            max={16} 
            step={1} 
            onValueChange={value => onAgeRangeChange(value as [number, number])} 
            className="mb-2 [&>.relative>.absolute]:bg-kids-teal" 
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{ageRange[0]} years</span>
            <span>{ageRange[1]} years</span>
          </div>
        </div> : <div className="flex justify-center w-full">
          <div className="relative flex overflow-x-auto pb-4 filter-scroll w-full" ref={scrollRef}>
            <div className="flex space-x-2">
              <Button variant={selectedOption === 'all' ? 'default' : 'outline'} size="sm" className={cn("flex-shrink-0 rounded-full px-4", selectedOption === 'all' ? 'bg-kids-teal text-white hover:bg-kids-teal/90' : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white')} onClick={() => onChange('all')}>
                All
              </Button>
              
              {options.map(option => <Button key={option.id} variant={selectedOption === option.id ? 'default' : 'outline'} size="sm" className={cn("flex-shrink-0 whitespace-nowrap rounded-full px-4", selectedOption === option.id ? 'bg-kids-teal text-white hover:bg-kids-teal/90' : 'border-kids-teal text-kids-teal hover:bg-kids-teal hover:text-white')} onClick={() => onChange(option.id)}>
                  {option.name}
                </Button>)}
            </div>
          </div>
        </div>}
    </div>;
};

export default FilterCarousel;