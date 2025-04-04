
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityById, ActivityDetailType } from '@/services';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import MapComponent from '@/components/MapComponent';
import BookingForm from '@/components/BookingForm';
import ReviewForm from '@/components/ReviewForm';
import { MapPin, Clock, Users, Star, Calendar, CheckCircle, Package, GitBranch, Compass, ExternalLink } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, toggleBookmark, isBookmarked, login } = useUser();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleBookNow = () => {
    if (isLoggedIn) {
      showSuccessToast();
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    showSuccessToast();
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

  const getAverageRating = () => {
    if (!activity?.reviews.length) return 0;
    const sum = activity.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / activity.reviews.length;
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    refetch(); // Refresh the activity data
  };

  const handleLoginRedirect = () => {
    setIsBookingModalOpen(false);
    navigate('/auth', { state: { returnUrl: window.location.pathname } });
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
            <Link to="/activities">
              <Button className="bg-kids-blue hover:bg-kids-blue/90">
                Browse All Activities
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const bookmarked = isLoggedIn && isBookmarked(activity.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 relative">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-96 object-cover rounded-xl shadow-md"
              />
              
              <span className="absolute top-4 left-4 bg-white/80 text-kids-teal text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                {activity.category}
              </span>
              
              {activity.featured && (
                <span className="absolute top-4 right-16 bg-kids-green text-white text-xs px-3 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              
              {isLoggedIn && (
                <button 
                  onClick={() => toggleBookmark(activity.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
                  aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={bookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 ${bookmarked ? "text-kids-pink" : "text-gray-600"}`}
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              )}
            </div>
            
            {mapLocation && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="mr-2 text-kids-blue" size={20} />
                  Location
                </h2>
                <MapComponent 
                  latitude={mapLocation.lat} 
                  longitude={mapLocation.lng} 
                  title={activity.title}
                  address={activity.location?.address || ''}
                />
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            <Tabs defaultValue="details" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({activity.reviews.length})</TabsTrigger>
                <TabsTrigger value="expectations">What to Expect</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Activity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Clock className="mr-3 text-kids-blue flex-shrink-0 mt-1" size={16} />
                    <div>
                      <h4 className="font-medium text-gray-700">Duration</h4>
                      <p className="text-gray-600">{activity.duration || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="mr-3 text-kids-green flex-shrink-0 mt-1" size={16} />
                    <div>
                      <h4 className="font-medium text-gray-700">Schedule</h4>
                      <p className="text-gray-600">{activity.schedule || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="mr-3 text-kids-purple flex-shrink-0 mt-1" size={16} />
                    <div>
                      <h4 className="font-medium text-gray-700">Group Size</h4>
                      <p className="text-gray-600">{activity.group_size || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Compass className="mr-3 text-kids-orange flex-shrink-0 mt-1" size={16} />
                    <div>
                      <h4 className="font-medium text-gray-700">Age Range</h4>
                      <p className="text-gray-600">
                        {activity.min_age && activity.max_age 
                          ? `${activity.min_age} - ${activity.max_age} years`
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {activity.organizer && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Organized by</h3>
                    <Link 
                      to={`/organizer/${activity.organizer.id}`}
                      className="block bg-gray-50 p-4 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-700">{activity.organizer.name}</h4>
                          {activity.organizer.description && (
                            <p className="text-gray-600 text-sm mt-1">{activity.organizer.description}</p>
                          )}
                        </div>
                        <ExternalLink className="text-kids-blue ml-2" size={16} />
                      </div>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="font-semibold">{getAverageRating().toFixed(1)}</span>
                    <span className="text-gray-500 mx-1">•</span>
                    <span className="text-gray-600 text-sm">{activity.reviews.length} reviews</span>
                  </div>
                  
                  {isLoggedIn && (
                    <Button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      variant="outline" 
                      className="border-kids-blue text-kids-blue"
                    >
                      {activity.userReview ? "Edit Your Review" : "Write a Review"}
                    </Button>
                  )}
                </div>
                
                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-8">
                    <ReviewForm 
                      activityId={activity.id}
                      userReview={activity.userReview}
                      onSuccess={handleReviewSuccess}
                    />
                  </div>
                )}
                
                <div className="space-y-6">
                  {activity.reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No reviews yet</p>
                  ) : (
                    activity.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{review.reviewer_name}</h4>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{new Date(review.review_date).toLocaleDateString()}</div>
                        {review.comment && <p className="text-gray-600">{review.comment}</p>}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="expectations" className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">What to Expect</h3>
                <ul className="space-y-3">
                  {activity.expectations.length === 0 ? (
                    <p className="text-gray-500">No expectations specified</p>
                  ) : (
                    activity.expectations.map(expectation => (
                      <li key={expectation.id} className="flex items-start">
                        <CheckCircle className="text-kids-green mr-2 flex-shrink-0 mt-1" size={16} />
                        <span className="text-gray-600">{expectation.description}</span>
                      </li>
                    ))
                  )}
                </ul>
              </TabsContent>
              
              <TabsContent value="requirements" className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">What to Bring</h3>
                <ul className="space-y-3">
                  {activity.requirements.length === 0 ? (
                    <p className="text-gray-500">No specific requirements</p>
                  ) : (
                    activity.requirements.map(requirement => (
                      <li key={requirement.id} className="flex items-start">
                        <CheckCircle className="text-kids-blue mr-2 flex-shrink-0 mt-1" size={16} />
                        <span className="text-gray-600">{requirement.description}</span>
                      </li>
                    ))
                  )}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{activity.title}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-kids-teal">${getCalculatedPrice()}</span>
                {selectedPackage && (
                  <span className="ml-2 text-sm text-gray-500">per package</span>
                )}
                {!selectedPackage && (
                  <span className="ml-2 text-sm text-gray-500">per person</span>
                )}
              </div>
              
              {activity.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">
                    <GitBranch className="inline mr-2" size={16} /> Variants
                  </h3>
                  <div className="space-y-2">
                    {activity.variants.map(variant => (
                      <div
                        key={variant.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedVariant === variant.id 
                            ? 'border-kids-blue bg-kids-blue/5' 
                            : 'border-gray-200 hover:border-kids-blue/50'
                        }`}
                        onClick={() => handleVariantSelect(variant.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800">{variant.name}</h4>
                            {variant.description && (
                              <p className="text-sm text-gray-600">{variant.description}</p>
                            )}
                          </div>
                          <div className="text-kids-teal font-semibold">
                            {variant.price_adjustment > 0 && '+'}
                            {variant.price_adjustment !== 0 && `$${variant.price_adjustment}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activity.packages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">
                    <Package className="inline mr-2" size={16} /> Packages
                  </h3>
                  <div className="space-y-2">
                    {activity.packages.map(pkg => (
                      <div
                        key={pkg.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPackage === pkg.id 
                            ? 'border-kids-orange bg-kids-orange/5' 
                            : 'border-gray-200 hover:border-kids-orange/50'
                        }`}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800">{pkg.name}</h4>
                            {pkg.description && (
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                            )}
                            {pkg.max_participants && (
                              <p className="text-xs text-gray-500">Up to {pkg.max_participants} participants</p>
                            )}
                          </div>
                          <div className="text-kids-teal font-semibold">${pkg.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full bg-kids-orange hover:bg-kids-orange/90 text-white rounded-full py-6 text-lg font-medium"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>No payment required to book</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
          </DialogHeader>
          {activity && (
            <BookingForm 
              activityId={activity.id}
              activityTitle={activity.title}
              variantId={selectedVariant}
              packageId={selectedPackage}
              price={getCalculatedPrice()}
              onSuccess={handleBookingSuccess}
              onLogin={handleLoginRedirect}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <footer className="bg-kids-blue/90 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5Z" fill="#5B8CD7"/>
                    <path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8V16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16V8Z" fill="#5B8CD7"/>
                    <path d="M17 8C17 7.44772 17.4477 7 18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17C17.4477 17 17 16.5523 17 16V8Z" fill="#5B8CD7"/>
                  </svg>
                </div>
                ActivityHub
              </h3>
              <p className="text-white/80">
                Your one-stop platform for booking amazing activities for kids of all ages in the Philippines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/activities" className="text-white/80 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/saved" className="text-white/80 hover:text-white transition-colors">Saved Activities</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-white/80">support@activityhub.com</p>
              <p className="text-white/80">123-456-7890</p>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} ActivityHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ActivityDetail;
