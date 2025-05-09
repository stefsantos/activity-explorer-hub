import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import ActivityCard from '@/components/ActivityCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Link } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/services';
import ActivityFooter from '@/components/activity/ActivityFooter';

const SavedActivities = () => {
  const { isLoggedIn, bookmarkedActivities } = useUser();
  const [savedActivities, setSavedActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch all activities from Supabase
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });

  useEffect(() => {
    if (!isLoggedIn || !activities.length) {
      return;
    }
    
    // Filter activities based on bookmarked IDs
    const filtered = activities.filter(activity => 
      bookmarkedActivities.includes(activity.id)
    );
    setSavedActivities(filtered);
  }, [isLoggedIn, bookmarkedActivities, activities]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Bookmark size={48} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">You need to be logged in</h1>
            <p className="text-gray-600 mb-8">Please log in to view your saved activities.</p>
            <Button onClick={() => navigate('/')} className="bg-brand-500 hover:bg-brand-600">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Saved Activities</h1>
        
        {savedActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bookmark size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No saved activities yet</h2>
            <p className="text-gray-500 mb-8">
              Browse activities and click the bookmark icon to save them for later.
            </p>
            <Button onClick={() => navigate('/activities')} className="bg-brand-500 hover:bg-brand-600">
              Browse Activities
            </Button>
          </div>
        )}
      </main>
      <ActivityFooter />
    </div>
  );
};

export default SavedActivities;
