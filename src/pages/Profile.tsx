
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, Calendar } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import BookedActivitiesList from '@/components/profile/BookedActivitiesList';

const Profile = () => {
  const { user, isLoggedIn, logout, bookmarkedActivities, userBookings, isLoadingBookings } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  if (!isLoggedIn) {
    navigate('/auth');
    return null;
  }

  const getInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return user.name.substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-kids-blue/30 to-kids-pink/30 p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="w-32 h-32 border-4 border-white bg-white">
                    <AvatarFallback className="text-4xl font-medium text-kids-blue">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'User'}</h1>
                    <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-2">
                      <Mail className="h-4 w-4 mr-2" />
                      {user?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex justify-end">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs 
            defaultValue="bookings" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Booked Activities</TabsTrigger>
              <TabsTrigger value="saved">Saved Activities</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Your Booked Activities</h2>
                <BookedActivitiesList 
                  bookings={userBookings}
                  isLoading={isLoadingBookings}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Saved Activities</h2>
                
                {bookmarkedActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved activities yet</h3>
                    <p className="text-gray-500 mb-6">When you save activities, they will appear here</p>
                    <Button onClick={() => navigate('/activities')}>
                      Explore Activities
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => navigate('/saved')}>
                    View All Saved Activities
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-gray-500 mb-4">Manage your account settings and preferences</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="border rounded-md p-3 bg-gray-50">{user?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="border rounded-md p-3 bg-gray-50">{user?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
