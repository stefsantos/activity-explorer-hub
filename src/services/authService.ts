
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export const signUp = async (data: SignUpData) => {
  try {
    // First check if the username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', data.username)
      .single();

    if (existingUser) {
      return { success: false, error: new Error('Username already exists') };
    }

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is what we want
      return { success: false, error: checkError };
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          phone: data.phone
        }
      }
    });

    if (authError) {
      console.error('Error signing up:', authError);
      return { success: false, error: authError };
    }

    return { success: true, data: authData };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { success: false, error };
  }
};

export const loginWithUsername = async ({ username, password }: LoginData) => {
  try {
    // First, find the email associated with the username
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.error('Error finding user:', profileError);
      return { success: false, error: new Error('Username not found') };
    }

    // Get the user with the associated auth data
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
      profileData.id
    );

    if (userError || !user) {
      console.error('Error retrieving user data:', userError);
      return { success: false, error: new Error('User not found') };
    }

    // Login with the retrieved email and provided password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password
    });

    if (error) {
      console.error('Error logging in:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in loginWithUsername:', error);
    return { success: false, error };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error logging out:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in logout:', error);
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return { success: false, error };
    }
    
    if (!data.user) {
      return { success: false, error: new Error('No user logged in') };
    }
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string): Promise<{ success: boolean; profile?: Profile; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error };
    }
    
    return { success: true, profile: data as Profile };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { success: false, error };
  }
};
