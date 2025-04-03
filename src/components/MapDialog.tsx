
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MapComponent from './MapComponent';
import { Activity } from '@/services/types';

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose, activities }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Activity Map</DialogTitle>
          <DialogDescription>
            View all activities and your current location on the map
          </DialogDescription>
        </DialogHeader>
        <div className="h-[70vh]">
          <MapComponent 
            className="h-full w-full"
            showUserLocation={true}
            centerOnUser={true}
            zoom={12}
            activities={activities}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
