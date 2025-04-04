
import React from 'react';
import { MapPin } from 'lucide-react';
import MapComponent from '@/components/MapComponent';

interface ActivityLocationProps {
  mapLocation: { lat: number; lng: number } | null;
  title: string;
  address: string;
}

const ActivityLocation = ({ mapLocation, title, address }: ActivityLocationProps) => {
  if (!mapLocation) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <MapPin className="mr-2 text-kids-blue" size={20} />
        Location
      </h2>
      <MapComponent 
        latitude={mapLocation.lat} 
        longitude={mapLocation.lng} 
        title={title}
        address={address}
      />
    </div>
  );
};

export default ActivityLocation;
