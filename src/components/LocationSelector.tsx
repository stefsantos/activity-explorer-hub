
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
  city?: string;
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
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  
  useEffect(() => {
    // Combine default Philippines locations with any from activities
    const locationMap = new Map<string, Location>();
    const citiesSet = new Set<string>();
    
    // Add default locations first
    defaultLocations.forEach(location => {
      locationMap.set(location.id, location);
      if (location.city) {
        citiesSet.add(location.city);
      }
    });
    
    // Add locations from activities
    activities.forEach(activity => {
      if (activity.location && typeof activity.location !== 'string') {
        const locationId = activity.location.id;
        if (!locationMap.has(locationId)) {
          locationMap.set(locationId, {
            id: activity.location.id,
            name: activity.location.name,
            latitude: activity.location.latitude || 0,
            longitude: activity.location.longitude || 0,
            address: activity.location.address,
            city: activity.location.city || activity.city
          });
        }
        
        // Add city from either location or activity
        const city = activity.location.city || activity.city;
        if (city) {
          citiesSet.add(city);
        }
      }
    });
    
    const allLocations = Array.from(locationMap.values());
    const allCities = Array.from(citiesSet);
    
    setLocationOptions(allLocations);
    setFilteredLocations(allLocations);
    setCityOptions(allCities.sort());
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
      (location.address && location.address.toLowerCase().includes(query)) ||
      (location.city && location.city.toLowerCase().includes(query))
    );
    
    setFilteredLocations(filtered);
  }, [searchQuery, locationOptions]);
  
  // Group locations by city
  const locationsByCity: Record<string, Location[]> = {};
  filteredLocations.forEach(location => {
    if (location.city) {
      if (!locationsByCity[location.city]) {
        locationsByCity[location.city] = [];
      }
      locationsByCity[location.city].push(location);
    } else {
      // Create an "Other" category for locations without a city
      if (!locationsByCity["Other"]) {
        locationsByCity["Other"] = [];
      }
      locationsByCity["Other"].push(location);
    }
  });
  
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
        
        {/* Display cities as main filter options */}
        {cityOptions.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1 px-2">Cities</h4>
            {cityOptions.map(city => {
              // Count activities in this city
              const locationsCount = locationsByCity[city]?.length || 0;
              
              return (
                <div 
                  key={`city-${city}`}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedLocation === `city-${city}` ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onLocationChange(`city-${city}`)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedLocation === `city-${city}` ? 'bg-amber-500' : 'border border-gray-400'
                    }`}></div>
                    <span className="font-medium">{city}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {locationsCount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Display specific locations */}
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1 px-2">Specific Locations</h4>
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
                {location.city && (
                  <span className="text-xs text-gray-500">
                    {location.city}
                  </span>
                )}
                {location.address && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <MapPin size={10} className="mr-1" /> {location.address}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
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
