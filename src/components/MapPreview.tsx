
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import MapDialog from './MapDialog';
import { Activity } from '@/services/types';

interface MapPreviewProps {
  activities: Activity[];
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ activities, className = "h-32" }) => {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  return (
    <div className="relative">
      <div className={`${className} bg-gray-100 rounded-lg relative overflow-hidden`}>
        <MapComponent 
          showUserLocation={true}
          centerOnUser={true}
          activities={activities}
          className={className}
          zoom={3}
        />
      </div>
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        onClick={() => setIsMapDialogOpen(true)}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-0 transition-opacity"></div>
        <span className="text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow">
          View larger map
        </span>
      </div>
      
      <MapDialog 
        isOpen={isMapDialogOpen} 
        onClose={() => setIsMapDialogOpen(false)} 
        activities={activities}
      />
    </div>
  );
};

export default MapPreview;
