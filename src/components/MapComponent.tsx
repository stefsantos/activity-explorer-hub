
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/services/types';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      // Add CSS for the popup styling
      const style = document.createElement('style');
      style.textContent = `
        .activity-popup {
          padding: 5px;
        }
        .activity-popup .price {
          font-weight: bold;
          color: #FF5A5F;
          margin-top: 4px;
        }
        .activity-popup .view-btn {
          background-color: #FF5A5F;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          margin-top: 5px;
          cursor: pointer;
          font-size: 12px;
        }
        .activity-popup .view-btn:hover {
          background-color: #FF4449;
        }
      `;
      document.head.appendChild(style);
      
      activities.forEach(activity => {
        if (activity.location && typeof activity.location !== 'string' && 
            activity.location.latitude !== undefined && activity.location.longitude !== undefined) {
          // Create a popup with activity details
          const popupHtml = `
            <div class="activity-popup">
              <strong>${activity.title}</strong>
              <p>${activity.location.address || activity.location.name}</p>
              <p class="price">₱${activity.price}</p>
              <button class="view-btn" data-activity-id="${activity.id}">View Activity</button>
            </div>
          `;
          
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(popupHtml);
          
          // Create marker
          const activityMarker = new mapboxgl.Marker({ color: '#FF5A5F' })
            .setLngLat([activity.location.longitude, activity.location.latitude] as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
          
          // Make marker clickable by setting cursor and adding event listener
          const markerElement = activityMarker.getElement();
          markerElement.style.cursor = 'pointer';
          
          // Add event listener to the marker
          markerElement.addEventListener('click', (e) => {
            // Prevent event from propagating to map
            e.stopPropagation();
            
            // Navigate to activity detail page
            navigate(`/activity/${activity.id}`);
          });
          
          // Show popup on hover
          markerElement.addEventListener('mouseenter', () => {
            activityMarker.togglePopup();
          });
          
          // Hide popup when no longer hovering
          // We'll use a small timeout to allow clicking on the popup
          let timeout: NodeJS.Timeout;
          markerElement.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
              if (popup.isOpen()) {
                activityMarker.togglePopup();
              }
            }, 300);
          });
          
          // Handle clicks on the View Activity button using event delegation
          popup.on('open', () => {
            // Use setTimeout to ensure the DOM is ready
            setTimeout(() => {
              const popupElement = popup.getElement();
              if (popupElement) {
                const viewBtn = popupElement.querySelector('.view-btn');
                if (viewBtn) {
                  viewBtn.addEventListener('click', () => {
                    // Fix the navigation path to match the route in App.tsx
                    navigate(`/activity/${activity.id}`);
                  });
                }
                
                // Cancel the timeout if the user moves back to the popup
                popupElement.addEventListener('mouseenter', () => {
                  clearTimeout(timeout);
                });
                
                popupElement.addEventListener('mouseleave', () => {
                  timeout = setTimeout(() => {
                    if (popup.isOpen()) {
                      activityMarker.togglePopup();
                    }
                  }, 300);
                });
              }
            }, 10);
          });
          
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
  }, [latitude, longitude, zoom, title, address, showUserLocation, activities, centerOnUser, navigate]);

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
