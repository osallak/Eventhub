import { Box, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <Paper
      sx={{
        height: { xs: 300, sm: 400 }, // Smaller height on mobile
        width: '100%',
        bgcolor: 'background.neutral',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography color="text.secondary">Loading map...</Typography>
    </Paper>
  ),
});

interface LocationMapProps {
  address?: string;
  city?: string;
  onLocationSelect: (location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: [number, number];
  }) => void;
  initialCoordinates?: [number, number];
}

export const LocationMap = ({
  address,
  city,
  onLocationSelect,
  initialCoordinates,
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    // Cleanup previous map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    if (!mapContainer.current) return;

    try {
      // Initialize mapbox
      if (typeof mapboxgl !== 'undefined' && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        const defaultCoordinates: [number, number] = [-7.2446531, 33.0662038];
        const coordinates = initialCoordinates || defaultCoordinates;

        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: coordinates,
          zoom: 15,
        });

        // Store map instance
        map.current = mapInstance;

        // Add marker after map loads
        mapInstance.on('load', () => {
          if (marker.current) {
            marker.current.remove();
          }

          marker.current = new mapboxgl.Marker({
            draggable: true,
          })
            .setLngLat(coordinates)
            .addTo(mapInstance);
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCoordinates]);

  return (
    <Box
      ref={mapContainer}
      sx={{
        width: '100%',
        height: '400px',
        borderRadius: 1,
      }}
    />
  );
};
