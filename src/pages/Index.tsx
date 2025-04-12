
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities, fetchCities } from '@/services';
import ActivityCard from '@/components/ActivityCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import Navbar from '@/components/Navbar';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from 'lucide-react';
import MapDialog from '@/components/MapDialog';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities', searchQuery, cityQuery],
    queryFn: () => fetchActivities({ search: searchQuery, city: cityQuery }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: Infinity, // Cities don't change often
  });
  
  const { data: featuredActivities = [] } = useQuery({
    queryKey: ['featuredActivities'],
    queryFn: () => fetchActivities({ featured: true }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (cities) {
      setFilteredCities(cities);
    }
  }, [cities]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (typeof cityQuery === 'string' && cityQuery) {
      setFilteredCities(cities.filter(city =>
        city.toLowerCase().includes(cityQuery.toLowerCase())
      ));
    } else {
      setFilteredCities(cities);
    }
  };

  const handleCityChange = (value: string) => {
    setCityQuery(value);
    setFilteredCities(
      cities.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
    );
  };

  return (
    <>
      <Navbar />
      <header className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-kids-blue to-kids-teal overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute bg-blob bg-kids-pink w-64 h-64 top-[-50px] left-[-50px]"></div>
        <div className="absolute bg-blob bg-kids-yellow w-72 h-72 bottom-[-80px] right-[-80px]"></div>
        <div className="absolute bg-blob bg-kids-orange w-56 h-56 top-1/2 left-[20%]"></div>

        <div className="container mx-auto px-4 relative z-10 flex items-center h-full">
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Fun Activities for Your Kids
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-80">
              Explore a wide range of activities and experiences designed to
              entertain, educate, and inspire children of all ages.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link to="/activities">
                <Button size="lg" className="bg-kids-orange hover:bg-kids-orange/90">
                  Explore Activities
                </Button>
              </Link>
              {/* <Button variant="outline" size="lg">
                Learn More
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Search Box */}
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              What are you looking for?
            </Label>
            <div className="relative">
              <Input
                id="search"
                type="search"
                placeholder="Search for activities"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* City Filter */}
          <div className="mb-6">
            <Label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              City
            </Label>
            <div className="relative">
              <Input
                id="city"
                type="search"
                placeholder="Enter a city"
                value={cityQuery}
                onChange={(e) => handleCityChange(e.target.value)}
                className="pl-10"
                list="cityOptions"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <datalist id="cityOptions">
                {filteredCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-12">
        <FeaturedCarousel activities={featuredActivities} />
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
          Explore All Activities
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-48"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading activities.</p>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <p>No activities found.</p>
        )}
      </section>
        
        {/* Map Dialog */}
        <MapDialog 
          isOpen={isMapDialogOpen} 
          onClose={() => setIsMapDialogOpen(false)} 
          activities={activities} 
        />
    </>
  );
};

export default Index;
