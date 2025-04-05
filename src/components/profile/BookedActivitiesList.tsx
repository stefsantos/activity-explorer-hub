
import React from 'react';
import { Calendar, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface BookingType {
  id: string;
  activity_id: string;
  activity: {
    id: string;
    title: string;
    image: string;
    category: string;
  };
  variant?: {
    id: string;
    name: string;
  };
  package?: {
    id: string;
    name: string;
    price: number;
  };
  booking_date: string;
  price: number;
  status: string;
}

interface BookedActivitiesListProps {
  bookings: BookingType[];
  isLoading: boolean;
}

const BookedActivitiesList = ({ bookings, isLoading }: BookedActivitiesListProps) => {
  const navigate = useNavigate();
  
  console.log('Rendering BookedActivitiesList with bookings:', bookings);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white rounded-lg shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row animate-pulse">
                <div className="w-full sm:w-36 h-36 bg-gray-200"></div>
                <div className="p-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 flex justify-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No booked activities yet</h3>
        <p className="text-gray-500 mb-6">When you book activities, they will appear here</p>
        <Button onClick={() => navigate('/activities')}>
          Explore Activities
        </Button>
      </div>
    );
  }

  return (
<div className="space-y-4">
  {bookings.map((booking) => (
    <Card key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row relative">
          {/* Status at the top-right */}
          <div
            className={`absolute top-4 right-4 text-sm rounded-full px-3 py-1 ${
              booking.status === 'Confirmed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {booking.status}
          </div>
          <div 
            className="w-full sm:w-36 h-36 bg-cover bg-center"
            style={{
              backgroundImage: `url(${booking.activity?.image || '/placeholder.svg'})`
            }}
          ></div>
          <div className="p-4 flex-1">
            <h3 className="font-semibold text-lg mb-1">{booking.activity?.title || 'Activity'}</h3>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {booking.booking_date ? format(new Date(booking.booking_date), 'PPP') : 'Date not specified'}
                </span>
              </div>
              
              {booking.variant && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.variant.name}</span>
                </div>
              )}
              
              {booking.package && (
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>{booking.package.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-kids-teal">₱{booking.price}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/activity/${booking.activity?.id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
  );
};
export default BookedActivitiesList;
