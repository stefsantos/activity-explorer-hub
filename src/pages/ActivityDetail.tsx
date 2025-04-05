
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityById } from '@/services';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useUser } from '@/contexts/UserContext';

// Import our component pieces
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityLocation from '@/components/activity/ActivityLocation';
import ActivityDescription from '@/components/activity/ActivityDescription';
import ActivityTabs from '@/components/activity/ActivityTabs';
import BookingCard from '@/components/activity/BookingCard';
import BookingDialog from '@/components/activity/BookingDialog';
import ActivityFooter from '@/components/activity/ActivityFooter';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: activity, isLoading, error, refetch } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => fetchActivityById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (activity?.location) {
      setMapLocation({
        lat: Number(activity.location.latitude),
        lng: Number(activity.location.longitude)
      });
    }
  }, [activity]);

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    
    const variant = activity?.variants.find(v => v.id === variantId);
    
    if (variant?.location) {
      setMapLocation({
        lat: Number(variant.location.latitude),
        lng: Number(variant.location.longitude)
      });
    } else if (activity?.location) {
      setMapLocation({
        lat: Number(activity.location.latitude),
        lng: Number(activity.location.longitude)
      });
    }
  };

  const handleBookNow = () => {
    if (isLoggedIn) {
      // showSuccessToast();
      setIsBookingModalOpen(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    showSuccessToast();
  };

  const handleLoginRedirect = () => {
    setIsBookingModalOpen(false);
    navigate('/auth', { state: { returnUrl: window.location.pathname } });
  };

  const showSuccessToast = () => {
    const selectedVariantDetails = selectedVariant 
      ? activity?.variants.find(v => v.id === selectedVariant)
      : null;
    
    const selectedPackageDetails = selectedPackage 
      ? activity?.packages.find(p => p.id === selectedPackage)
      : null;

    let bookingMessage = `Booking "${activity?.title}"`;
    if (selectedVariantDetails) {
      bookingMessage += ` - ${selectedVariantDetails.name} variant`;
    }
    if (selectedPackageDetails) {
      bookingMessage += ` - ${selectedPackageDetails.name} package`;
    }

    toast({
      title: "Booking Confirmed!",
      description: bookingMessage,
      variant: "default"
    });
  };

  const getCalculatedPrice = () => {
    if (!activity) return 0;
    
    let basePrice = activity.price;
    
    if (selectedVariant) {
      const variant = activity.variants.find(v => v.id === selectedVariant);
      if (variant) {
        basePrice += variant.price_adjustment;
      }
    }
    
    if (selectedPackage) {
      const pkg = activity.packages.find(p => p.id === selectedPackage);
      if (pkg) {
        return pkg.price;
      }
    }
    
    return basePrice;
  };

  const handleReviewSuccess = () => {
    refetch(); // Refresh the activity data
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-96">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Activity Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find the activity you're looking for.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityHeader 
              id={activity.id} 
              image={activity.image} 
              images={activity.images}
              title={activity.title} 
              category={activity.category} 
              featured={activity.featured} 
            />
            
            <ActivityLocation 
              mapLocation={mapLocation} 
              title={activity.title} 
              address={activity.location?.address || ''} 
            />
            
            <ActivityDescription description={activity.description} />
            
            <ActivityTabs 
              activity={activity} 
              onReviewSuccess={handleReviewSuccess} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <BookingCard 
              activity={activity}
              onBookNow={handleBookNow}
              selectedVariant={selectedVariant}
              setSelectedVariant={handleVariantSelect}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              getCalculatedPrice={getCalculatedPrice}
            />
          </div>
        </div>
      </main>
      
      <BookingDialog 
        isOpen={isBookingModalOpen} 
        onOpenChange={setIsBookingModalOpen}
        activityId={activity.id}
        activityTitle={activity.title}
        variantId={selectedVariant}
        packageId={selectedPackage}
        price={getCalculatedPrice()}
        onSuccess={handleBookingSuccess}
        onLogin={handleLoginRedirect}
      />
      
      <ActivityFooter />
    </div>
  );
};

export default ActivityDetail;
