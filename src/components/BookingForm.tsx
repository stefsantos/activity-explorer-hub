import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Mail, Phone, User, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "@/services/bookingService";

const bookingFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  notes: z.string().optional()
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
  const { isLoggedIn, user, refreshBookings } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [receipt, setReceipt] = useState<File | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      first_name: user?.name ? user.name.split(' ')[0] : "",
      last_name: user?.name ? user.name.split(' ').slice(1).join(' ') : "",
      email: user?.email || "",
      phone: "",
      notes: ""
    }
  });

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const { success, error } = await createBooking({
        activity_id: activityId,
        variant_id: variantId,
        package_id: packageId,
        user_id: isLoggedIn ? user?.id : null,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        price: price,
        notes: data.notes
        // receipt not sent here, assumed handled separately if needed
      });

      if (!success) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking. Please try again.');
        return;
      }

      if (isLoggedIn) {
        await refreshBookings();
      }

      toast.success('Booking successfully created!');
      onSuccess();
    } catch (error) {
      console.error('Error in booking submission:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/auth', { state: { returnUrl: window.location.pathname } });
    onLogin();
  };

  const handleNextStep = (values: BookingFormValues) => {
    if (price === 0) {
      form.handleSubmit(onSubmit)();
    } else {
      setStep(2);
    }
  };

  const handleReceiptSubmit = () => {
    if (!receipt) {
      toast.error('Please upload a GCash receipt.');
      return;
    }
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">You will receive an email with the details shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
            <p className="text-sm text-gray-600">
              Please enter your contact information below to complete your booking for {activityTitle}.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="first_name" render={({ field }) => (
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
                )} />

                <FormField control={form.control} name="last_name" render={({ field }) => (
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
                )} />
              </div>

              <FormField control={form.control} name="email" render={({ field }) => (
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
              )} />

              <FormField control={form.control} name="phone" render={({ field }) => (
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
              )} />

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kids-orange"
                      placeholder="Leave a note or message for the seller..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col space-y-2 mt-6">
                <Button type="submit" className="bg-kids-orange hover:bg-kids-orange/90 text-white">
                  Continue
                </Button>

                {!isLoggedIn && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">Already have an account?</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-kids-blue hover:text-kids-blue/90"
                      onClick={handleLoginRedirect}
                    >
                      Log in to book faster
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </>
      )}

      {step === 2 && (
        <div>
  <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload GCash Receipt</h3>
  <p className="text-sm text-gray-600 mb-4">
    Please upload your GCash payment receipt to confirm your booking.
  </p>
  <img src={"/GCASH.png"} alt={"09173728852"} className="w-full mb-4" />

  {/* Section for copying GCash number */}
  <div className="flex items-center justify-between bg-gray-100 p-3 rounded mb-4">
    <span className="text-gray-800 font-medium">GCash Number: 09173728852</span>
    <button
      onClick={() => navigator.clipboard.writeText("09173728852")}
      className="text-sm bg-kids-orange hover:bg-kids-orange/90 text-white py-1 px-3 rounded"
    >
      Copy Number
    </button>
  </div>

  <div className="space-y-4">
    <div className="relative">
      <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        type="file"
        accept="image/*"
        className="pl-10"
        onChange={handleReceiptChange}
      />
    </div>
    <Button
      onClick={handleReceiptSubmit}
      className="bg-kids-orange hover:bg-kids-orange/90 text-white"
    >
      Submit Receipt
    </Button>
  </div>
</div>

      )}
    </div>
  );
};

export default BookingForm;
