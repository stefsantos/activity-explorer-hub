import React, { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import MapPreview from '@/components/MapPreview';
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
  ChevronDown,
  Map as MapIcon,
  Link
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
import { 
  fetchActivities 
} from '@/services';
import LocationSelector from '@/components/LocationSelector';
import ActivityFooter from '@/components/activity/ActivityFooter';

const ActivityList = () => {
  const maximum_price = 20000;

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 16]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maximum_price]);
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
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });

  useEffect(() => {
    let filtered = [...activities];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        (activity.description && activity.description.toLowerCase().includes(query)) ||
        (activity.category && activity.category.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => 
        activity.category && activity.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    if (locationFilter !== 'all' && locationFilter !== '') {
      filtered = filtered.filter(activity => {
        if (!activity.location || typeof activity.location === 'string') {
          return false;
        }
        
        // Use the location ID for filtering
        return activity.location.id === locationFilter;
      });
    }
    
    filtered = filtered.filter(activity => {
      const minAge = activity.min_age || 0;
      const maxAge = activity.max_age || 18;
      return minAge <= ageRange[1] && maxAge >= ageRange[0];
    });

    filtered = filtered.filter(activity => {
      const price = activity.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (ratingFilter > 0) {
      filtered = filtered.filter(activity => {
        return (activity.rating || 0) >= ratingFilter;
      });
    }
    
    const itemsPerPage = 12;
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
    setAgeRange([0, 16]);
    setPriceRange([0, maximum_price]);
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

  const getCategoryIcon = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Sports": "bg-blue-500",
      "Arts & Crafts": "bg-pink-500",
      "Music": "bg-purple-500",
      "Outdoors": "bg-green-500",
      "Educational": "bg-blue-500",
      "Cooking": "bg-red-500",
      "Technology": "bg-yellow-500",
      "Gaming": "bg-green-500",
      "Entertainment": "bg-teal-500",
    };
    
    return categoryColors[category] || "bg-gray-500";
  };

  // Extract unique locations from activities for the filter
  const getLocationOptions = () => {
    const locationSet = new Set<string>();
    const locationOptions = [];
    
    // Add the default Philippine locations
    locationOptions.push(...locations);
    
    // Add any additional locations from activities that aren't in our predefined list
    activities.forEach(activity => {
      if (activity.location && typeof activity.location !== 'string') {
        const locationId = activity.location.id;
        if (!locationSet.has(locationId) && !locationOptions.find(loc => loc.id === locationId)) {
          locationSet.add(locationId);
          locationOptions.push({
            id: activity.location.id,
            name: activity.location.name,
            latitude: activity.location.latitude,
            longitude: activity.location.longitude
          });
        }
      }
    });
    
    return locationOptions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
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
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  Filter by
                </h2>
                {(categoryFilter !== 'all' || 
                  locationFilter !== 'all' || 
                  ageRange[0] !== 0 || 
                  ageRange[1] !== 16 || 
                  priceRange[0] !== 0 || 
                  priceRange[1] !== maximum_price ||
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
              
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Activity Type</h3>
                <div className="grid grid-cols-3 gap-3">
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
                        category.id === categoryFilter 
                          ? 'bg-amber-500 text-white' 
                          : `${getCategoryIcon(category.name)} text-white`
                      }`}>
                        {category.name[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-medium block truncate">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Age Range</h3>
                <div className="px-2">
                  <Slider 
                    defaultValue={[0, 16]} 
                    value={ageRange}
                    min={0} 
                    max={16}
                    step={1}
                    onValueChange={(value) => setAgeRange(value as [number, number])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{ageRange[0]} years</span>
                    <span>{ageRange[1]} years</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider 
                    defaultValue={[0, maximum_price]} 
                    value={priceRange}
                    min={0} 
                    max={maximum_price}
                    step={100}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₱{priceRange[0]}</span>
                    <span>₱{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <Collapsible className="mb-6" open={isLocationDropdownOpen} onOpenChange={setIsLocationDropdownOpen}>
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <MapPin size={16} className="mr-1" />
                    Location in Philippines
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <LocationSelector 
                    activities={activities} 
                    selectedLocation={locationFilter}
                    onLocationChange={setLocationFilter}
                  />
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible className="mb-6">
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h3 className="text-md font-semibold flex items-center">
                    <MapIcon size={16} className="mr-1" />
                    Map
                  </h3>
                  <ChevronDown size={16} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <MapPreview activities={activities} />
                </CollapsibleContent>
              </Collapsible>
              
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
          
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <ActivityFooter />
    </div>
  );
};

export default ActivityList;
