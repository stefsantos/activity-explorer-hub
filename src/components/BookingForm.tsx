
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Calendar, Mail, Phone, User } from "lucide-react";

const bookingFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits")
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  activityId: string;
  activityTitle: string;
  variantId: string | null;
  packageId: string | null;
  price: number;
  onSuccess: () => void;
  onLogin: () => void;
}

const BookingForm = ({
  activityId,
  activityTitle,
  variantId,
  packageId,
  price,
  onSuccess,
  onLogin
}: BookingFormProps) => {
  const { isLoggedIn, user } = useUser();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      first_name: user?.name ? user.name.split(' ')[0] : "",
      last_name: user?.name ? user.name.split(' ').slice(1).join(' ') : "",
      email: user?.email || "",
      phone: ""
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      // Insert the booking into the database
      const { error } = await supabase
        .from('activity_bookings')
        .insert({
          activity_id: activityId,
          variant_id: variantId || null,
          package_id: packageId || null,
          user_id: isLoggedIn ? user?.id : null,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          price: price
        });

      if (error) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking. Please try again.');
        return;
      }

      toast.success('Booking successfully created!');
      onSuccess();
    } catch (error) {
      console.error('Error in booking submission:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
        <p className="text-sm text-gray-600">
          Please enter your contact information below to complete your booking for {activityTitle}.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="First Name" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Last Name" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Email" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Phone" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-2 mt-6">
            <Button 
              type="submit" 
              className="bg-kids-orange hover:bg-kids-orange/90 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Processing...' : 'Complete Booking'}
            </Button>
            
            {!isLoggedIn && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">Already have an account?</p>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="text-kids-blue hover:text-kids-blue/90"
                  onClick={onLogin}
                >
                  Log in to book faster
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
