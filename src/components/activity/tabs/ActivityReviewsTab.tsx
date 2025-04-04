
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import ReviewForm from '@/components/ReviewForm';
import { ActivityDetailType } from '@/services/types';

interface ActivityReviewsTabProps {
  activity: ActivityDetailType;
  onReviewSuccess: () => void;
}

const ActivityReviewsTab = ({ activity, onReviewSuccess }: ActivityReviewsTabProps) => {
  const { isLoggedIn } = useUser();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const getAverageRating = () => {
    if (!activity?.reviews.length) return 0;
    const sum = activity.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / activity.reviews.length;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
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
            onSuccess={() => {
              setShowReviewForm(false);
              onReviewSuccess();
            }}
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
    </div>
  );
};

export default ActivityReviewsTab;
