
import React, { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import FilterCarousel from '@/components/FilterCarousel';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { 
  filterActivities,
  categories,
  locations,
  ageRanges,
  Activity
} from '@/data/activities';

const ActivityList = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const { activities: filtered, totalPages: pages } = filterActivities(
      categoryFilter,
      locationFilter,
      ageRangeFilter,
      currentPage,
      9
    );
    setFilteredActivities(filtered);
    setTotalPages(pages);
  }, [categoryFilter, locationFilter, ageRangeFilter, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Activities</h1>
        
        {/* Filter Section */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            <FilterCarousel 
              title="Categories"
              options={categories}
              selectedOption={categoryFilter}
              onChange={(id) => {
                setCategoryFilter(id);
                setCurrentPage(1);
              }}
            />
            
            <FilterCarousel 
              title="Locations"
              options={locations}
              selectedOption={locationFilter}
              onChange={(id) => {
                setLocationFilter(id);
                setCurrentPage(1);
              }}
            />
            
            <FilterCarousel 
              title="Age Ranges"
              options={ageRanges}
              selectedOption={ageRangeFilter}
              onChange={(id) => {
                setAgeRangeFilter(id);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>
        
        {/* Activity List */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
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
