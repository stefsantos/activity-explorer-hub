
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Activity, Calendar, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import { fetchOrganizerById } from '@/services/supabaseService';
import { useToast } from "@/hooks/use-toast";

const OrganizerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: organizer, isLoading, error } = useQuery({
    queryKey: ['organizer', id],
    queryFn: () => fetchOrganizerById(id as string),
    enabled: !!id,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load organizer information",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading organizer details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !organizer) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-lg text-red-500">Failed to load organizer details</p>
            <Link to="/" className="mt-4 text-blue-500 hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{organizer.name}</h1>
          <p className="text-gray-600 mt-2">{organizer.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">About the Organizer</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {organizer.description || "No information available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Contact Information</h3>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>contact@{organizer.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>(555) 123-4567</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Business Hours</h3>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 3:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Activities</h2>
          <Separator className="my-4" />
        </div>

        {organizer.activities && organizer.activities.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizer.activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>
                      {activity.min_age && activity.max_age
                        ? `${activity.min_age}-${activity.max_age} years`
                        : activity.min_age
                        ? `${activity.min_age}+ years`
                        : "All ages"}
                    </TableCell>
                    <TableCell>${activity.price}</TableCell>
                    <TableCell>
                      {activity.rating ? `${activity.rating.toFixed(1)}/5` : "No ratings"}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/activity/${activity.id}`}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
            <Activity className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">No activities available from this organizer</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrganizerDetail;
