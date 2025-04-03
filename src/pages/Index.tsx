import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ActivityCard from '@/components/ActivityCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import FilterCarousel from '@/components/FilterCarousel';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { categories, locations, ageRanges } from '@/data/activities';
import { Palette, Users, Mountain, BookOpen, Music, Utensils, HeartPulse, FlaskConical } from 'lucide-react';
import { fetchFeaturedActivities, fetchPopularActivities, fetchActivities } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { checkAndSeedActivities } from '@/utils/seedData';
import { toast } from 'sonner';

const Index = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [seedAttempted, setSeedAttempted] = useState(false);

  useEffect(() => {
    const attemptSeed = async () => {
      if (seedAttempted) return;
      
      try {
        await checkAndSeedActivities();
        setSeedAttempted(true);
      } catch (error) {
        console.error("Error seeding activities:", error);
      }
    };
    
    attemptSeed();
  }, [seedAttempted]);

  const {
    data: allActivities = [],
    isLoading: allActivitiesLoading,
    error: allActivitiesError,
    refetch: refetchAllActivities
  } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    retry: 3,
    staleTime: 30000
  });
  
  const {
    data: featuredActivities = [],
    isLoading: featuredActivitiesLoading,
    error: featuredActivitiesError,
    refetch: refetchFeaturedActivities
  } = useQuery({
    queryKey: ['featuredActivities'],
    queryFn: fetchFeaturedActivities,
    retry: 3,
    staleTime: 30000
  });
  
  const {
    data: popularActivities = [],
    isLoading: popularActivitiesLoading,
    error: popularActivitiesError,
    refetch: refetchPopularActivities
  } = useQuery({
    queryKey: ['popularActivities'],
    queryFn: () => fetchPopularActivities(4),
    retry: 3,
    staleTime: 30000
  });

  useEffect(() => {
    if (
      !allActivitiesLoading && 
      !featuredActivitiesLoading && 
      !popularActivitiesLoading && 
      seedAttempted && 
      allActivities.length === 0
    ) {
      const timeoutId = setTimeout(() => {
        console.log("No activities found after seeding, trying to refetch...");
        refetchAllActivities();
        refetchFeaturedActivities();
        refetchPopularActivities();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    allActivities, 
    allActivitiesLoading, 
    featuredActivitiesLoading, 
    popularActivitiesLoading, 
    seedAttempted,
    refetchAllActivities,
    refetchFeaturedActivities,
    refetchPopularActivities
  ]);

  useEffect(() => {
    if (allActivitiesError) {
      console.error("Error loading all activities:", allActivitiesError);
      toast.error("Failed to load activities. Please try again later.");
    }
    if (featuredActivitiesError) {
      console.error("Error loading featured activities:", featuredActivitiesError);
      toast.error("Failed to load featured activities. Please try again later.");
    }
    if (popularActivitiesError) {
      console.error("Error loading popular activities:", popularActivitiesError);
      toast.error("Failed to load popular activities. Please try again later.");
    }
    
    console.log("Loaded activities:", {
      all: allActivities?.length || 0,
      featured: featuredActivities?.length || 0,
      popular: popularActivities?.length || 0
    });
  }, [
    allActivities, 
    featuredActivities, 
    popularActivities, 
    allActivitiesError, 
    featuredActivitiesError, 
    popularActivitiesError
  ]);

  useEffect(() => {
    let filtered = [...allActivities];
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (locationFilter !== 'all' && locationFilter !== '') {
      filtered = filtered.filter(activity => activity.location && activity.location.name.toLowerCase() === locationFilter.toLowerCase());
    }

    if (ageRangeFilter !== 'all' && ageRangeFilter !== '') {
      filtered = filtered.filter(activity => {
        if (ageRangeFilter === 'toddler') return activity.min_age === 0 && activity.max_age === 3;
        if (ageRangeFilter === 'preschool') return activity.min_age === 3 && activity.max_age === 5;
        if (ageRangeFilter === 'children') return activity.min_age === 6 && activity.max_age === 12;
        if (ageRangeFilter === 'teens') return activity.min_age === 13 && activity.max_age === 17;
        if (ageRangeFilter === 'youngAdults') return activity.min_age === 18 && activity.max_age === 25;
        if (ageRangeFilter === 'adults') return activity.min_age === 25;
        if (ageRangeFilter === 'family') return true;
        return true;
      });
    }

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedActivities = filtered.slice(startIndex, startIndex + itemsPerPage);
    setFilteredActivities(paginatedActivities);
  }, [allActivities, categoryFilter, locationFilter, ageRangeFilter, currentPage]);

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
          
          {featuredActivitiesLoading ? (
            <div className="w-full h-[450px] bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">
              <p className="text-gray-500">Loading featured activities...</p>
            </div>
          ) : (
            <FeaturedCarousel activities={featuredActivities} />
          )}
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
            {popularActivitiesLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-1/3 mt-auto"></div>
                  </div>
                </div>
              ))
            ) : popularActivities.length > 0 ? (
              popularActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />)
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-500">No popular activities found</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore by Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map(category => <div key={category.id} className="text-center cursor-pointer" onClick={() => {
            setCategoryFilter(category.id);
            setCurrentPage(1);
          }}>
                <div className={`category-icon ${getCategoryColor(category.name)}`}>
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-xs font-medium text-gray-700">{category.name}</span>
              </div>)}
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Find the Perfect Activity</h2>
          
          <FilterCarousel title="Locations" options={locations} selectedOption={locationFilter} onChange={id => {
          setLocationFilter(id);
          setCurrentPage(1);
        }} />
          
          <FilterCarousel title="Age Ranges" options={ageRanges} selectedOption={ageRangeFilter} onChange={id => {
          setAgeRangeFilter(id);
          setCurrentPage(1);
        }} />
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
      
      <footer className="bg-kids-blue/90 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5Z" fill="#5B8CD7" />
                    <path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8V16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16V8Z" fill="#5B8CD7" />
                    <path d="M17 8C17 7.44772 17.4477 7 18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17C17.4477 17 17 16.5523 17 16V8Z" fill="#5B8CD7" />
                  </svg>
                </div>
                ActivityHub
              </h3>
              <p className="text-white/80">
                Your one-stop platform for booking amazing activities for kids of all ages in the Philippines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/activities" className="text-white/80 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/saved" className="text-white/80 hover:text-white transition-colors">Saved Activities</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-white/80">support@activityhub.com</p>
              <p className="text-white/80">123-456-7890</p>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9-1.381-.419.419-.824.679-1.38.896-.42.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} ActivityHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
