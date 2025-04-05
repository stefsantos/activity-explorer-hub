
import { supabase } from "@/integrations/supabase/client";

export interface BookingData {
  activity_id: string;
  variant_id: string | null;
  package_id: string | null;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  price: number;
  booking_date?: string;
  status?: string;
}

export interface BookingResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export async function createBooking(bookingData: BookingData): Promise<BookingResponse> {
  try {
    // Set default booking date and status if not provided
    const fullBookingData = {
      ...bookingData,
      booking_date: bookingData.booking_date || new Date().toISOString(),
      status: bookingData.status || 'pending'
    };
    
    const { data, error } = await supabase
      .from('activity_bookings')
      .insert(fullBookingData)
      .select();
    
    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in createBooking:', error);
    return { success: false, error };
  }
}

export async function fetchUserBookings(userId: string | null, email: string | null): Promise<BookingResponse> {
  try {
    console.log('Fetching bookings for user:', userId || email);
    
    if (!userId && !email) {
      return { success: false, error: 'No user ID or email provided' };
    }
    
    let query = supabase
      .from('activity_bookings')
      .select(`
        *,
        activity:activities(id, title, image, category),
        variant:activity_variants(id, name),
        package:activity_packages(id, name, price)
      `)
      .order('booking_date', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error };
    }
    
    console.log('Bookings fetched:', data?.length || 0, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in fetchUserBookings:', error);
    return { success: false, error };
  }
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<BookingResponse> {
  try {
    const { data, error } = await supabase
      .from('activity_bookings')
      .update({ status })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    return { success: false, error };
  }
}
