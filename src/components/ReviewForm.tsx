
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitReview as submitReviewDirect, deleteReview as deleteReviewDirect } from '@/services'; // Updated import path
import { useUser } from '@/contexts/UserContext';

type ReviewFormValues = {
  comment: string;
};

interface ReviewFormProps {
  activityId: string;
  userReview?: {
    id: string;
    rating: number;
    comment: string | null;
    review_date: string;
  } | null;
  onSuccess?: () => void;
}

const ReviewForm = ({ activityId, userReview, onSuccess }: ReviewFormProps) => {
  const { isLoggedIn, login } = useUser();
  const [rating, setRating] = useState<number>(userReview?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: userReview?.comment || ''
    }
  });

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (!isLoggedIn) {
      toast("Please login to submit a review");
      login();
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await submitReviewDirect(activityId, rating, values.comment || undefined);
      
      if (result.success) {
        toast.success(userReview ? "Review updated successfully" : "Review submitted successfully");
        queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Error submitting review");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview?.id) return;
    
    if (confirm("Are you sure you want to delete your review?")) {
      setIsDeleting(true);
      
      try {
        const result = await deleteReviewDirect(userReview.id);
        
        if (result.success) {
          toast.success("Review deleted successfully");
          queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
          setRating(0);
          form.reset({ comment: '' });
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.error || "Error deleting review");
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <p className="text-gray-600 mb-4">You need to be logged in to submit a review.</p>
        <Button onClick={login}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        {userReview ? "Edit Your Review" : "Write a Review"}
      </h3>
      
      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-600">Your Rating</p>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="p-1 focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-6 h-6 ${
                  rating >= star
                    ? "text-yellow-500 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Share your experience with this activity (optional)"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between">
            <Button 
              type="submit" 
              disabled={isSubmitting || isDeleting}
              className="bg-kids-blue hover:bg-kids-blue/90"
            >
              {isSubmitting ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
            </Button>
            
            {userReview && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteReview}
                disabled={isDeleting || isSubmitting}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                {isDeleting ? "Deleting..." : "Delete Review"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
