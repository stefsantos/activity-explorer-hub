
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/services/supabaseService';
import Navbar from '@/components/Navbar';
import ActivityCard from '@/components/ActivityCard';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Filter, MapPin, Star, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories, locations, ageRanges } from '@/data/activities';
import CategoryButton from '@/components/CategoryButton';

const ActivityList = () => {
  // State for filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRange, setAgeRange] = useState([0, 18]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [durationFilter, setDurationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch activities from Supabase
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });

  // Apply filters
  useEffect(() => {
    if (activities) {
      let filtered = [...activities];

      // Category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(
          activity => activity.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      // Location filter
      if (locationFilter !== 'all') {
        filtered = filtered.filter(
          activity => activity.location?.name.toLowerCase() === locationFilter.toLowerCase()
        );
      }

      // Age range filter
      filtered = filtered.filter(
        activity => (
          (activity.min_age >= ageRange[0] || activity.min_age === null) &&
          (activity.max_age <= ageRange[1] || activity.max_age === null)
        )
      );

      // Price range filter
      filtered = filtered.filter(
        activity => (
          activity.price >= priceRange[0] && 
          activity.price <= priceRange[1]
        )
      );

      // Duration filter
      if (durationFilter !== 'all') {
        const durationMap: {[key: string]: [number, number]} = {
          'short': [0, 60],
          'medium': [60, 180],
          'long': [180, Infinity]
        };

        if (durationMap[durationFilter]) {
          const [min, max] = durationMap[durationFilter];
          filtered = filtered.filter(
            activity => (
              activity.duration >= min && 
              activity.duration <= max
            )
          );
        }
      }

      // Rating filter
      if (ratingFilter > 0) {
        filtered = filtered.filter(
          activity => activity.rating >= ratingFilter
        );
      }

      // Calculate pagination
      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      setTotalPages(totalPages || 1);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
      const paginatedActivities = filtered.slice(startIndex, endIndex);
      
      setFilteredActivities(paginatedActivities);
    }
  }, [activities, categoryFilter, locationFilter, ageRange, priceRange, durationFilter, ratingFilter, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar - Hidden on mobile unless toggled */}
          <aside className={cn(
            "filter-sidebar bg-white rounded-xl shadow-sm p-6 md:w-72 w-full sticky top-20 h-fit",
            isMobileFilterOpen ? "block" : "hidden md:block"
          )}>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>
              
              {/* Filter by Category */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Type</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      className={cn(
                        "px-3 py-2 rounded-lg cursor-pointer text-sm font-medium",
                        categoryFilter === category.id
                          ? "bg-kids-blue/10 text-kids-blue"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                      onClick={() => setCategoryFilter(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Age Range Slider */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Age Range</h3>
                <Slider 
                  defaultValue={[0, 18]} 
                  max={18} 
                  step={1} 
                  value={ageRange}
                  onValueChange={setAgeRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{ageRange[0]} years</span>
                  <span>{ageRange[1]} years</span>
                </div>
              </div>
              
              {/* Price Range Slider */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
                <Slider 
                  defaultValue={[0, 5000]} 
                  max={5000} 
                  step={100} 
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₱{priceRange[0]}</span>
                  <span>₱{priceRange[1]}</span>
                </div>
              </div>
              
              {/* Location Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Location</h3>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Availability Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Availability</h3>
                <ToggleGroup type="single" className="flex flex-wrap gap-2">
                  <ToggleGroupItem value="weekdays" className="text-xs rounded-full">
                    Weekdays
                  </ToggleGroupItem>
                  <ToggleGroupItem value="weekends" className="text-xs rounded-full">
                    Weekends
                  </ToggleGroupItem>
                  <ToggleGroupItem value="holidays" className="text-xs rounded-full">
                    Holidays
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Duration Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Duration</h3>
                <ToggleGroup 
                  type="single" 
                  value={durationFilter}
                  onValueChange={(value) => value && setDurationFilter(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="all" className="text-xs rounded-full">
                    Any
                  </ToggleGroupItem>
                  <ToggleGroupItem value="short" className="text-xs rounded-full">
                    Short (&lt; 1hr)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="medium" className="text-xs rounded-full">
                    Medium (1-3hrs)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="long" className="text-xs rounded-full">
                    Long (3+hrs)
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Rating</h3>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full",
                        ratingFilter === rating 
                          ? "bg-kids-blue text-white" 
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {rating === 0 ? "All" : rating}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setCategoryFilter('all');
                  setLocationFilter('all');
                  setAgeRange([0, 18]);
                  setPriceRange([0, 5000]);
                  setDurationFilter('all');
                  setRatingFilter(0);
                }}
                variant="outline" 
                className="w-full border-gray-300 text-gray-600 text-sm"
              >
                Reset Filters
              </Button>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
              <Button 
                onClick={toggleMobileFilter}
                variant="outline" 
                className="w-full flex items-center justify-center border-gray-300"
              >
                <Filter size={16} className="mr-2" />
                {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {/* Category Buttons */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
                {categories.map(category => (
                  <CategoryButton 
                    key={category.id}
                    category={category.name}
                    onClick={() => setCategoryFilter(category.id)}
                    isActive={categoryFilter === category.id}
                  />
                ))}
              </div>
            </div>
            
            {/* Results Count and Sort */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                All Activities
                <span className="text-gray-500 text-sm font-normal ml-2">
                  ({activities.length} results)
                </span>
              </h2>
              
              <select className="border border-gray-300 rounded-lg text-sm p-2">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
                <option>Newest</option>
              </select>
            </div>
            
            {/* Display Activities */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="spinner"></div>
                <p className="mt-4 text-gray-600">Loading activities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 bg-red-50 rounded-xl px-4">
                <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600">We couldn't load the activities. Please try again later.</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl px-4">
                <Filter size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No activities found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or browse all activities</p>
                <Button 
                  onClick={() => {
                    setCategoryFilter('all');
                    setLocationFilter('all');
                    setAgeRange([0, 18]);
                    setPriceRange([0, 5000]);
                    setDurationFilter('all');
                    setRatingFilter(0);
                  }}
                  className="bg-kids-blue hover:bg-kids-blue/90"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredActivities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-8">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
