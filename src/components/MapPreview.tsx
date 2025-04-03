
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import MapDialog from './MapDialog';
import { Activity } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface MapPreviewProps {
  activities: Activity[];
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ activities, className = "h-32" }) => {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className={`${className} bg-gray-100 rounded-lg relative overflow-hidden`}>
        <MapComponent 
          showUserLocation={true}
          centerOnUser={true}
          activities={activities}
          className={className}
          zoom={12}
        />
      </div>
      
      <Button 
        variant="outline"
        className="mt-2 w-full flex items-center justify-center text-xs font-medium text-blue-600"
        onClick={() => setIsMapDialogOpen(true)}
      >
        <Map size={14} className="mr-1" />
        View larger map
      </Button>
      
      <MapDialog 
        isOpen={isMapDialogOpen} 
        onClose={() => setIsMapDialogOpen(false)} 
        activities={activities}
      />
    </div>
  );
};

export default MapPreview;
