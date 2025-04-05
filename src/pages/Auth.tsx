
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner';
import { Facebook, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ActivityFooter from '@/components/activity/ActivityFooter';

const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

const signUpFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const Auth = () => {
  const { user, signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const returnUrl = location.state?.returnUrl || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(returnUrl, { replace: true });
    }
  }, [user, navigate, returnUrl]);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const onSignIn = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
      toast.success('Signed in successfully!');
      navigate(returnUrl, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(
        data.email,
        data.password,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || '',
        }
      );
      if (error) throw error;
      toast.success('Account created successfully! Check your email to confirm your account.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'facebook' | 'google') => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Error signing in with ${provider}`);
      setIsLoading(false);
    }
  };

  return (<>
    <Navbar />
    <div className="grid h-screen place-items-center bg-gray-100">
      <Card className="w-[350px] md:w-[500px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Authentication</CardTitle>
          <CardDescription className="text-center">Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList>
              <TabsTrigger value="sign-in" className="w-1/2">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up" className="w-1/2">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sign-in" className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="mail@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Password" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-kids-orange hover:bg-kids-orange/90" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In with Email'}
                  </Button>
                </form>
              </Form>
              
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleOAuthSignIn('facebook')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOAuthSignIn('google')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20H24v8h11.3c-1.2 5-5.3 8.8-11.3 8.8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6.1-6.1C33.9 6.5 29.2 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l7.1 5.2c1.8-5 6.7-8.7 12.6-8.7 3 0 5.8 1.1 7.9 3l6.1-6.1C33.9 6.5 29.2 4 24 4c-8.8 0-16.3 5.4-19.7 12.7z"/>
                    <path fill="#4CAF50" d="M24 44c5 0 9.6-1.7 13.2-4.6l-6.4-5.4c-1.9 1.3-4.4 2-6.8 2-6 0-11.1-3.8-12.9-8.8l-7.1 5.4C7.6 38.4 15.1 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.6 2.5-2.1 4.8-4.2 6.2l6.4 5.4c3.7-3.4 6-8.4 6-14.4 0-1.3-.1-2.7-.4-4z"/>
                  </svg>
                  Google
                </Button>
              </div> */}
            </TabsContent>
            
            <TabsContent value="sign-up" className="space-y-4">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={signUpForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="mail@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Password" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm Password" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone" {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-kids-orange hover:bg-kids-orange/90" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
{/* 
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleOAuthSignIn('facebook')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOAuthSignIn('google')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20H24v8h11.3c-1.2 5-5.3 8.8-11.3 8.8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6.1-6.1C33.9 6.5 29.2 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l7.1 5.2c1.8-5 6.7-8.7 12.6-8.7 3 0 5.8 1.1 7.9 3l6.1-6.1C33.9 6.5 29.2 4 24 4c-8.8 0-16.3 5.4-19.7 12.7z"/>
                    <path fill="#4CAF50" d="M24 44c5 0 9.6-1.7 13.2-4.6l-6.4-5.4c-1.9 1.3-4.4 2-6.8 2-6 0-11.1-3.8-12.9-8.8l-7.1 5.4C7.6 38.4 15.1 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.6 2.5-2.1 4.8-4.2 6.2l6.4 5.4c3.7-3.4 6-8.4 6-14.4 0-1.3-.1-2.7-.4-4z"/>
                  </svg>
                  Google
                </Button>
              </div> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    <ActivityFooter />
    </>);
};

export default Auth;
