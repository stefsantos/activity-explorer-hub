
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ActivityCard from '@/components/ActivityCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import FilterCarousel from '@/components/FilterCarousel';
import CityFilterCarousel from '@/components/CityFilterCarousel';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { categories, locations, ageRanges } from '@/data/activities';
import { Palette, Users, Mountain, BookOpen, Music, Utensils, HeartPulse, FlaskConical } from 'lucide-react';
import { fetchFeaturedActivities, fetchPopularActivities, fetchActivities } from '@/services';
import { useQuery } from '@tanstack/react-query';
import ActivityFooter from '@/components/activity/ActivityFooter';

const Index = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([1, 16]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get unique cities from locations
  const cities = [...new Set(locations.map(loc => loc.city))]
    .filter(Boolean)
    .map(city => ({ id: city?.toLowerCase() || '', name: city || '' }));
  
  const {
    data: allActivities = []
  } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });
  
  const {
    data: featuredActivities = []
  } = useQuery({
    queryKey: ['featuredActivities'],
    queryFn: fetchFeaturedActivities
  });
  
  const {
    data: popularActivities = []
  } = useQuery({
    queryKey: ['popularActivities'],
    queryFn: () => fetchPopularActivities(4)
  });
  
  useEffect(() => {
    let filtered = [...allActivities];
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category && activity.category.toLowerCase && activity.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    
    if (locationFilter !== 'all') {
      if (locationFilter.startsWith('city-')) {
        // Filter by city
        const city = locationFilter.replace('city-', '');
        filtered = filtered.filter(activity => activity.city === city);
      } else {
        // Filter by specific location
        filtered = filtered.filter(activity => 
          activity.location && 
          typeof activity.location === 'string' && 
          activity.location.toLowerCase() === locationFilter.toLowerCase()
        );
      }
    }
    
    // Filter by age range slider
    filtered = filtered.filter(activity => {
      const minAge = activity.min_age || 0;
      const maxAge = activity.max_age || 18;
      return minAge <= ageRange[1] && maxAge >= ageRange[0];
    });
    
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedActivities = filtered.slice(startIndex, startIndex + itemsPerPage);
    setFilteredActivities(paginatedActivities);
  }, [allActivities, categoryFilter, locationFilter, ageRange, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById('activity-list')?.offsetTop ?? 0,
      behavior: 'smooth'
    });
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Arts & Crafts':
        return <Palette size={24} />;
      case 'Sports':
        return <HeartPulse size={24} />;
      case 'Outdoors':
        return <Mountain size={24} />;
      case 'Education':
        return <BookOpen size={24} />;
      case 'Music':
        return <Music size={24} />;
      case 'Cooking':
        return <Utensils size={24} />;
      case 'Science':
        return <FlaskConical size={24} />;
      default:
        return <Users size={24} />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Arts & Crafts':
        return 'bg-kids-teal';
      case 'Sports':
        return 'bg-kids-yellow';
      case 'Outdoors':
        return 'bg-kids-green';
      case 'Education':
        return 'bg-kids-blue';
      case 'Music':
        return 'bg-kids-purple';
      case 'Cooking':
        return 'bg-kids-orange';
      case 'Science':
        return 'bg-kids-lime';
      default:
        return 'bg-kids-pink';
    }
  };
  
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10 text-center relative">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="text-gray-800">The Largest Kids Activity</span>
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-800">Platform in the </span>
            <span className="text-kids-orange">Philippines.</span>
          </h2>
          
          <FeaturedCarousel activities={featuredActivities} />
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Our Most Popular Activities</h2>
            <Link to="/activities" className="text-kids-teal font-medium text-sm hover:underline flex items-center">
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
          </div>
        </section>
        
        <CategoryFilter categories={categories} selectedCategory={categoryFilter} onChange={id => {
        setCategoryFilter(id);
        setCurrentPage(1);
      }} getCategoryIcon={getCategoryIcon} getCategoryColor={getCategoryColor} />
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Find the Perfect Activity</h2>
          
          <CityFilterCarousel 
            title="Cities in the Philippines" 
            cities={cities} 
            selectedCity={locationFilter} 
            onChange={id => {
              setLocationFilter(id);
              setCurrentPage(1);
            }} 
          />
          
          <FilterCarousel 
            title="Age Ranges" 
            options={ageRanges} 
            selectedOption={ageRangeFilter} 
            onChange={id => {
              setAgeRangeFilter(id);
              setCurrentPage(1);
            }}
            isAgeFilter={true}
            ageRange={ageRange}
            onAgeRangeChange={(value) => {
              setAgeRange(value);
              setCurrentPage(1);
            }}
          />
        </section>
        
        <section id="activity-list" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Activities Just For You</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.length > 0 ? filteredActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />) : <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your filters or browse all activities</p>
              </div>}
          </div>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          
          <div className="text-center mt-10">
            <Link to="/activities">
              <Button className="bg-kids-orange hover:bg-kids-orange/90 text-white rounded-full px-8 py-6 text-lg font-medium">
                See All Activities
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <ActivityFooter />
    </div>;
};
export default Index;
