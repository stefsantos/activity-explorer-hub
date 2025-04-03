
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { activities, Activity } from '@/data/activities';
import ActivityCard from '@/components/ActivityCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

const SavedActivities = () => {
  const { isLoggedIn, bookmarkedActivities } = useUser();
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    
    const filtered = activities.filter(activity => 
      bookmarkedActivities.includes(activity.id)
    );
    setSavedActivities(filtered);
  }, [isLoggedIn, bookmarkedActivities]);

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

export default SavedActivities;
