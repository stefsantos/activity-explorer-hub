
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, getUserProfile, logout as authLogout, Profile } from '@/services/authService';

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  bookmarkedActivities: string[];
  login: () => void;
  logout: () => void;
  toggleBookmark: (activityId: string) => void;
  isBookmarked: (activityId: string) => boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookmarkedActivities, setBookmarkedActivities] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Initialize user auth state
  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsLoggedIn(!!currentUser);
        
        if (currentUser) {
          // Fetch the user profile when auth state changes
          const { success, profile: userProfile } = await getUserProfile(currentUser.id);
          if (success && userProfile) {
            setProfile(userProfile);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    // Then check if there's an existing session
    checkUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch saved bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedActivities');
    if (savedBookmarks) {
      setBookmarkedActivities(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    if (bookmarkedActivities.length > 0) {
      localStorage.setItem('bookmarkedActivities', JSON.stringify(bookmarkedActivities));
    }
  }, [bookmarkedActivities]);

  const checkUser = async () => {
    const { success, user: currentUser } = await getCurrentUser();
    if (success && currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
      
      // Fetch user profile
      const profileResult = await getUserProfile(currentUser.id);
      if (profileResult.success && profileResult.profile) {
        setProfile(profileResult.profile);
      }
    }
  };

  const refreshUser = async () => {
    await checkUser();
  };

  const login = () => {
    // This is just a placeholder for demo purposes
    // The actual login will be handled by the login page
    toast("Please use the login page to sign in");
  };

  const logout = async () => {
    const { success, error } = await authLogout();
    
    if (success) {
      setUser(null);
      setProfile(null);
      setIsLoggedIn(false);
      toast("Logged out successfully");
    } else {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
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
      profile,
      isLoggedIn, 
      bookmarkedActivities, 
      login, 
      logout, 
      toggleBookmark, 
      isBookmarked,
      refreshUser
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
