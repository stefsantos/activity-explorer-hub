
import React, { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  X,
  Filter,
  ChevronDown
} from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  categories,
  locations,
  ageRanges,
} from '@/data/activities';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/services/supabaseService';

const ActivityList = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [ageRange, setAgeRange] = useState<[number, number]>([1, 16]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilters, setAvailabilityFilters] = useState({
    today: false,
    tomorrow: false,
    weekend: false,
    next7Days: false,
    next30Days: false
  });
  const [durationFilters, setDurationFilters] = useState({
    short: false,
    half: false,
    full: false,
    multiDay: false
  });
  const [ratingFilter, setRatingFilter] = useState(0);

  // Fetch activities from Supabase
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });

  useEffect(() => {
    // Filter activities based on selected filters
    let filtered = [...activities];
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        (activity.description && activity.description.toLowerCase().includes(query)) ||
        (activity.category && activity.category.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => 
        activity.category && activity.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Location filter
    if (locationFilter !== 'all' && locationFilter !== '') {
      filtered = filtered.filter(activity => 
        activity.location && activity.location.name.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    // Age range filtering
    filtered = filtered.filter(activity => {
      const minAge = activity.min_age || 0;
      const maxAge = activity.max_age || 18;
      return minAge <= ageRange[1] && maxAge >= ageRange[0];
    });

    // Price range filtering
    filtered = filtered.filter(activity => {
      const price = activity.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(activity => {
        return (activity.rating || 0) >= ratingFilter;
      });
    }
    
    // Pagination
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPages || 1);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedActivities = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredActivities(paginatedActivities);
  }, [
    activities, 
    categoryFilter, 
    locationFilter, 
    ageRange, 
    priceRange, 
    ratingFilter,
    searchQuery,
    currentPage
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const resetFilters = () => {
    setCategoryFilter('all');
    setLocationFilter('all');
    setAgeRange([1, 16]);
    setPriceRange([0, 5000]);
    setRatingFilter(0);
    setAvailabilityFilters({
      today: false,
      tomorrow: false,
      weekend: false,
      next7Days: false,
      next30Days: false
    });
    setDurationFilters({
      short: false,
      half: false,
      full: false,
      multiDay: false
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">All Activities</h1>
          <p className="text-gray-600">Discover and book amazing activities for your kids</p>
        </div>
        
        {/* Main content area with sidebar and results */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filter by
                </h2>
                {(categoryFilter !== 'all' || 
                  locationFilter !== 'all' || 
                  ageRange[0] !== 1 || 
                  ageRange[1] !== 16 || 
                  priceRange[0] !== 0 || 
                  priceRange[1] !== 5000 ||
                  ratingFilter !== 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-amber-500 hover:text-amber-600 p-0 h-auto"
                  >
                    <X size={14} className="mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              
              {/* Activity Type / Category */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Activity Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 9).map((category) => (
                    <div 
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id === categoryFilter ? 'all' : category.id)}
                      className={`cursor-pointer text-center p-2 rounded-lg ${
                        category.id === categoryFilter 
                          ? 'bg-amber-100 border-amber-300 border' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-1 ${
                        category.id === categoryFilter ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'
                      }`}>
                        {/* Icon would go here */}
                        {category.id[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-medium block truncate">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Age Range Slider */}
              <Collapsible defaultOpen={true} className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold">Age Range</h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="px-2">
                    <Slider 
                      defaultValue={[1, 16]} 
                      value={ageRange}
                      min={1} 
                      max={16}
                      step={1}
                      onValueChange={(value) => setAgeRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{ageRange[0]} years</span>
                      <span>{ageRange[1]} years</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Price Range Slider */}
              <Collapsible defaultOpen={true} className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold">Price Range</h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="px-2">
                    <Slider 
                      defaultValue={[0, 5000]} 
                      value={priceRange}
                      min={0} 
                      max={5000}
                      step={100}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₱{priceRange[0]}</span>
                      <span>₱{priceRange[1]}</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Location */}
              <Collapsible className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <MapPin size={16} className="mr-1" />
                    Location
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="mb-2">
                    <Input 
                      placeholder="Select Location" 
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Availability */}
              <Collapsible className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Availability
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-2">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: 'tomorrow', label: 'Tomorrow' },
                      { id: 'weekend', label: 'This Weekend' },
                      { id: 'next7Days', label: 'Next 7 Days' },
                      { id: 'next30Days', label: 'Next 30 Days' }
                    ].map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`availability-${option.id}`} 
                          checked={availabilityFilters[option.id as keyof typeof availabilityFilters]}
                          onCheckedChange={(checked) => 
                            setAvailabilityFilters({
                              ...availabilityFilters,
                              [option.id]: checked
                            })
                          }
                        />
                        <Label htmlFor={`availability-${option.id}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Duration */}
              <Collapsible className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <Clock size={16} className="mr-1" />
                    Duration
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-2">
                    {[
                      { id: 'short', label: 'Short Session (1-2 hours)' },
                      { id: 'half', label: 'Half Session (2-4 hours)' },
                      { id: 'full', label: 'Full Day (4 hours)' },
                      { id: 'multiDay', label: 'Multi-Day Programs' }
                    ].map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`duration-${option.id}`} 
                          checked={durationFilters[option.id as keyof typeof durationFilters]}
                          onCheckedChange={(checked) => 
                            setDurationFilters({
                              ...durationFilters,
                              [option.id]: checked
                            })
                          }
                        />
                        <Label htmlFor={`duration-${option.id}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Rating */}
              <Collapsible className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <Star size={16} className="mr-1" />
                    Rating
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div 
                        key={rating} 
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                      >
                        <div className={`w-4 h-4 rounded-full ${rating === ratingFilter ? 'bg-amber-500' : 'border border-gray-300'}`}></div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Activity Results */}
          <div className="flex-grow">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Search for activities, parks, events, and fun!"
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Activity Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-80 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredActivities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredActivities.map(activity => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No activities found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                    <Button 
                      onClick={resetFilters}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {/* Pagination */}
            {filteredActivities.length > 0 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ActivityHub</h3>
              <p className="text-gray-300">
                Discover and book amazing activities for all ages.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/activities" className="text-gray-300 hover:text-white">Activities</a></li>
                <li><a href="/saved" className="text-gray-300 hover:text-white">Saved Activities</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">support@activityhub.com</p>
              <p className="text-gray-300">123-456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ActivityHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ActivityList;
