
import React, { useState } from 'react';
import { Package, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityDetailType } from '@/services/types';

interface BookingCardProps {
  activity: ActivityDetailType;
  onBookNow: () => void;
  selectedVariant: string | null;
  setSelectedVariant: (variantId: string) => void;
  selectedPackage: string | null;
  setSelectedPackage: (packageId: string) => void;
  getCalculatedPrice: () => number;
}

const BookingCard = ({ 
  activity, 
  onBookNow, 
  selectedVariant, 
  setSelectedVariant, 
  selectedPackage, 
  setSelectedPackage,
  getCalculatedPrice
}: BookingCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{activity.title}</h1>
      
      <div className="flex items-center mb-4">
        <span className="text-2xl font-bold text-kids-teal">₱{getCalculatedPrice()}</span>
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
                onClick={() => setSelectedVariant(variant.id)}
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
                onClick={() => setSelectedPackage(pkg.id)}
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
                  <div className="text-kids-teal font-semibold">₱{pkg.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        className="w-full bg-kids-orange hover:bg-kids-orange/90 text-white rounded-full py-6 text-lg font-medium"
        onClick={onBookNow}
      >
        Book Now
      </Button>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>No payment required to book</p>
      </div>
    </div>
  );
};

export default BookingCard;
