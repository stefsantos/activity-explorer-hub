
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/services/types';

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
  title?: string;
  address?: string;
  showUserLocation?: boolean;
  activities?: Activity[];
  centerOnUser?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15,
  className = "h-96 w-full",
  title,
  address,
  showUserLocation = false,
  activities = [],
  centerOnUser = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const activityMarkers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlZnNhbiIsImEiOiJjbHoxam4yYjkwMTFsMmpxMXAwanhnYjUwIn0.4ZrFH4gFhNA-iWsASTG97Q';
    
    const initialCenter: [number, number] = [longitude || 0, latitude || 0];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Get user location if requested
    if (showUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (centerOnUser && map.current) {
            map.current.flyTo({
              center: [longitude, latitude] as [number, number],
              zoom: zoom,
              essential: true
            });
          }
          
          // Add user location marker with a different color
          if (map.current) {
            new mapboxgl.Marker({ color: '#8B4513' }) // Brown color
              .setLngLat([longitude, latitude] as [number, number])
              .addTo(map.current)
              .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'));
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }

    // Add main marker if coordinates are provided
    if (latitude && longitude) {
      marker.current = new mapboxgl.Marker({ color: '#FF5A5F' })
        .setLngLat([longitude, latitude] as [number, number])
        .addTo(map.current);

      // Add popup if title and address are provided
      if (title && address) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<strong>${title}</strong><p>${address}</p>`);
        
        marker.current.setPopup(popup);
      }
    }

    // Add activity markers
    if (activities.length > 0 && map.current) {
      activities.forEach(activity => {
        if (activity.location && activity.location.latitude && activity.location.longitude) {
          const activityMarker = new mapboxgl.Marker({ color: '#FF5A5F' })
            .setLngLat([activity.location.longitude, activity.location.latitude] as [number, number])
            .addTo(map.current!);
          
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<strong>${activity.title}</strong><p>${activity.location.address}</p>`);
          
          activityMarker.setPopup(popup);
          activityMarkers.current.push(activityMarker);
        }
      });
    }

    // Cleanup
    return () => {
      activityMarkers.current.forEach(marker => marker.remove());
      activityMarkers.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, title, address, showUserLocation, activities, centerOnUser]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker.current && map.current && latitude && longitude) {
      marker.current.setLngLat([longitude, latitude] as [number, number]);
      
      if (!centerOnUser || !userLocation) {
        map.current.flyTo({
          center: [longitude, latitude] as [number, number],
          zoom: zoom,
          essential: true
        });
      }
    }
  }, [latitude, longitude, zoom, centerOnUser, userLocation]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapComponent;
