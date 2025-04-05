
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (id: string) => void;
  getCategoryIcon: (category: string) => React.ReactNode;
  getCategoryColor: (category: string) => string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onChange,
  getCategoryIcon,
  getCategoryColor,
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
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Explore by Category</h2>
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
      
      <div className="flex justify-center w-full">
        <div 
          className="relative flex overflow-x-auto pb-4 filter-scroll w-full" 
          ref={scrollRef}
        >
          <div className="flex w-full justify-between">
            <div 
              className={cn(
                "flex-shrink-0 text-center cursor-pointer flex flex-col items-center mx-1",
                selectedCategory === 'all' ? 'opacity-100' : 'opacity-80'
              )}
              onClick={() => onChange('all')}
            >
              <div className={cn(
                "category-icon flex items-center justify-center rounded-full w-16 h-16 text-white mb-2",
                "bg-kids-blue"
              )}>
                {getCategoryIcon('All')}
              </div>
              <span className="text-xs font-medium text-gray-700">All</span>
            </div>
            
            {categories.map(category => (
              <div 
                key={category.id} 
                className={cn(
                  "flex-shrink-0 text-center cursor-pointer flex flex-col items-center mx-1",
                  selectedCategory === category.id ? 'opacity-100' : 'opacity-80'
                )}
                onClick={() => onChange(category.id)}
              >
                <div className={cn("category-icon", getCategoryColor(category.name))}>
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-xs font-medium text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
