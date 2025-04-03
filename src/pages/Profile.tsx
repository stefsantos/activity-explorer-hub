
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { UserCircle } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: user?.email || '',
      phone: profile?.phone || '',
    },
    values: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: user?.email || '',
      phone: profile?.phone || '',
    }
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    const { success, error } = await updateProfile({
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
    });
    setIsLoading(false);

    if (success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md text-center p-8">
          <p>You need to be logged in to view this page.</p>
          <Button 
            className="mt-4 bg-kids-blue hover:bg-kids-blue/90" 
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <UserCircle size={64} className="text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>View and update your account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                      <Input type="email" {...field} disabled />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-kids-blue hover:bg-kids-blue/90" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
          
          <Separator className="my-6" />
          
          <div className="pt-2">
            <h3 className="text-lg font-medium mb-4">Account Actions</h3>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
