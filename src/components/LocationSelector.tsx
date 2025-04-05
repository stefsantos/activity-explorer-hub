
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { locations as defaultLocations } from '@/data/activities';
import { Activity } from '@/services/types';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationSelectorProps {
  activities: Activity[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  activities, 
  selectedLocation, 
  onLocationChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationOptions, setLocationOptions] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  
  useEffect(() => {
    // Combine default Philippines locations with any from activities
    const locationMap = new Map<string, Location>();
    
    // Add default locations first
    defaultLocations.forEach(location => {
      locationMap.set(location.id, location);
    });
    
    // Add locations from activities
    activities.forEach(activity => {
      if (activity.location && typeof activity.location !== 'string') {
        const locationId = activity.location.id;
        if (!locationMap.has(locationId)) {
          locationMap.set(locationId, {
            id: activity.location.id,
            name: activity.location.name,
            latitude: activity.location.latitude,
            longitude: activity.location.longitude,
            address: activity.location.address
          });
        }
      }
    });
    
    const allLocations = Array.from(locationMap.values());
    setLocationOptions(allLocations);
    setFilteredLocations(allLocations);
  }, [activities]);
  
  // Filter locations when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredLocations(locationOptions);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = locationOptions.filter(location => 
      location.name.toLowerCase().includes(query) || 
      (location.address && location.address.toLowerCase().includes(query))
    );
    
    setFilteredLocations(filtered);
  }, [searchQuery, locationOptions]);
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search locations..."
          className="pl-8 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
        <div 
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedLocation === 'all' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onLocationChange('all')}
        >
          <div className={`w-3 h-3 rounded-full ${
            selectedLocation === 'all' ? 'bg-amber-500' : 'border border-gray-400'
          }`}></div>
          <span>All Locations</span>
        </div>
        
        {filteredLocations.map(location => (
          <div 
            key={location.id}
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              selectedLocation === location.id ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => onLocationChange(location.id)}
          >
            <div className={`w-3 h-3 rounded-full ${
              selectedLocation === location.id ? 'bg-amber-500' : 'border border-gray-400'
            }`}></div>
            <div className="flex flex-col">
              <span className="font-medium">{location.name}</span>
              {location.address && (
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin size={10} className="mr-1" /> {location.address}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {filteredLocations.length === 0 && (
          <div className="text-center py-3 text-gray-500">
            No locations found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
