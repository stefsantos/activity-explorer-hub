
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

// Define types
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string; // Make email optional since it might come from a join
  phone: string;
  username: string;
  created_at: string;
  updated_at: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<{ error: Error | null }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      });
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      // Add email from auth.user if not present in profile
      if (data && user?.email) {
        setProfile({ ...data, email: user.email });
      } else if (data) {
        // Cast data to UserProfile and set it
        setProfile(data as unknown as UserProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };
  
  // Login
  const login = async ({ email, password }: LoginData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Successfully signed in!');
      navigate('/');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };
  
  // Sign up
  const signUp = async ({ email, password, first_name, last_name, phone }: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
            phone,
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Account created successfully!');
      navigate('/');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };
  
  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    toast.success('Successfully signed out');
    navigate('/auth/login');
  };
  
  // Update profile
  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) {
      return { error: new Error('You must be logged in to update your profile') };
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      // Refresh profile
      await fetchProfile(user.id);
      toast.success('Profile updated successfully!');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };
  
  const value = {
    user,
    profile,
    isLoading,
    login,
    signUp,
    logout,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
