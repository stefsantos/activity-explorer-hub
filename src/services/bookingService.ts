
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
}

export async function createBooking(bookingData: BookingData) {
  try {
    const { data, error } = await supabase
      .from('activity_bookings')
      .insert(bookingData)
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

export async function fetchUserBookings(userId: string | null, email: string | null) {
  try {
    let query = supabase
      .from('activity_bookings')
      .select(`
        *,
        activity:activity_id(id, title, image, price, category),
        variant:variant_id(id, name),
        package:package_id(id, name, price)
      `)
      .order('booking_date', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      return { success: false, error: new Error('No user ID or email provided') };
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in fetchUserBookings:', error);
    return { success: false, error };
  }
}
