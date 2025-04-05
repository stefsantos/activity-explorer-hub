
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { fetchUserBookings } from '@/services/bookingService';

type User = {
  id: string;
  name: string;
  email: string;
};

type Booking = {
  id: string;
  activity_id: string;
  activity: {
    id: string;
    title: string;
    image: string;
    category: string;
  };
  variant?: {
    id: string;
    name: string;
  };
  package?: {
    id: string;
    name: string;
    price: number;
  };
  booking_date: string;
  price: number;
  status: string;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  bookmarkedActivities: string[];
  userBookings: Booking[];
  isLoadingBookings: boolean;
  login: () => void;
  logout: () => void;
  toggleBookmark: (activityId: string) => void;
  isBookmarked: (activityId: string) => boolean;
  refreshBookings: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkedActivities, setBookmarkedActivities] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedActivities');
    if (savedBookmarks) {
      setBookmarkedActivities(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.first_name 
          ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name || ''}`
          : authUser.email || 'User',
        email: authUser.email || '',
      });
      setIsLoggedIn(true);
      
      // Load user bookings when user is authenticated
      refreshBookings();
    } else {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
        setIsLoggedIn(true);
        
        // For demo users, we can't load real bookings so we clear them
        setUserBookings([]);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserBookings([]);
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (bookmarkedActivities.length > 0) {
      localStorage.setItem('bookmarkedActivities', JSON.stringify(bookmarkedActivities));
    }
  }, [bookmarkedActivities]);

  const refreshBookings = async () => {
    if (!isLoggedIn || !user) return;
    
    setIsLoadingBookings(true);
    try {
      const { success, data, error } = await fetchUserBookings(
        authUser ? authUser.id : null, 
        user.email
      );
      
      if (success && data) {
        console.log('Setting user bookings:', data);
        setUserBookings(data as Booking[]);
      } else if (error) {
        console.error('Error fetching bookings:', error);
      }
    } catch (error) {
      console.error('Error in refreshBookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const login = () => {
    if (authUser) return;

    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com'
    };
    
    setUser(mockUser);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    toast("Logged in successfully");
  };

  const logout = async () => {
    if (authUser) {
      await signOut();
    }
    
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setUserBookings([]);
    toast("Logged out successfully");
  };

  const toggleBookmark = (activityId: string) => {
    if (!isLoggedIn) {
      toast("Please log in to bookmark activities");
      return;
    }
    
    setBookmarkedActivities(prevBookmarks => {
      if (prevBookmarks.includes(activityId)) {
        toast("Removed from bookmarks");
        return prevBookmarks.filter(id => id !== activityId);
      } else {
        toast("Added to bookmarks");
        return [...prevBookmarks, activityId];
      }
    });
  };

  const isBookmarked = (activityId: string): boolean => {
    return bookmarkedActivities.includes(activityId);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoggedIn, 
      bookmarkedActivities, 
      userBookings,
      isLoadingBookings,
      login, 
      logout, 
      toggleBookmark, 
      isBookmarked,
      refreshBookings
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export async function getUserProfile() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}
