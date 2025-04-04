
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookingForm from '@/components/BookingForm';

interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string;
  activityTitle: string;
  variantId: string | null;
  packageId: string | null;
  price: number;
  onSuccess: () => void;
  onLogin: () => void;
}

const BookingDialog = ({ 
  isOpen, 
  onOpenChange, 
  activityId, 
  activityTitle, 
  variantId, 
  packageId, 
  price, 
  onSuccess, 
  onLogin 
}: BookingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>
        <BookingForm 
          activityId={activityId}
          activityTitle={activityTitle}
          variantId={variantId}
          packageId={packageId}
          price={price}
          onSuccess={onSuccess}
          onLogin={onLogin}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
