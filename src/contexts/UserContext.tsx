
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  bookmarkedActivities: string[];
  login: () => void;
  logout: () => void;
  toggleBookmark: (activityId: string) => void;
  isBookmarked: (activityId: string) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkedActivities, setBookmarkedActivities] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Simulate loading saved bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedActivities');
    if (savedBookmarks) {
      setBookmarkedActivities(JSON.parse(savedBookmarks));
    }
    
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (bookmarkedActivities.length > 0) {
      localStorage.setItem('bookmarkedActivities', JSON.stringify(bookmarkedActivities));
    }
  }, [bookmarkedActivities]);

  const login = () => {
    // Mock login - in a real app, this would involve authentication
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

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
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
      login, 
      logout, 
      toggleBookmark, 
      isBookmarked
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
