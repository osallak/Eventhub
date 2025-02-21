import { Box } from '@mui/material';
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
    if (!mapContainer.current || map.current) return;

    const defaultCoordinates: [number, number] = [-7.24465310, 33.06620380]; // Default to Casablanca
    const coordinates = initialCoordinates || defaultCoordinates;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 15,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    });

    marker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(coordinates)
      .addTo(map.current);

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
        height: '100%',
      }}
    />
  );
};
