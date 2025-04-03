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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsLoggedIn(!!currentUser);
        
        if (currentUser) {
          const { success, profile: userProfile } = await getUserProfile(currentUser.id);
          if (success && userProfile) {
            setProfile({
              ...userProfile,
              email: currentUser.email || undefined
            });
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedActivities');
    if (savedBookmarks) {
      setBookmarkedActivities(JSON.parse(savedBookmarks));
    }
  }, []);

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
      
      const profileResult = await getUserProfile(currentUser.id);
      if (profileResult.success && profileResult.profile) {
        setProfile({
          ...profileResult.profile,
          email: currentUser.email || undefined
        });
      }
    }
  };

  const refreshUser = async () => {
    await checkUser();
  };

  const login = () => {
    toast("Please use the login page to sign in");
  };

  const logout = async () => {
    console.log("Logging out user...");
    try {
      const { success, error } = await authLogout();
      
      if (success) {
        console.log("Logout successful");
        setUser(null);
        setProfile(null);
        setIsLoggedIn(false);
        toast("Logged out successfully");
      } else {
        console.error("Logout error:", error);
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Exception during logout:", error);
      toast.error("An error occurred during logout");
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
