import { Box, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

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
    if (!mapContainer.current || map.current) {
      return;
    }

    const initialCenter = initialCoordinates || [lng, lat];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom,
    });

    marker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(initialCenter)
      .addTo(map.current);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        '& > div': {
          width: '100% !important',
          maxWidth: '100%',
          '& .mapboxgl-map': {
            maxWidth: '100%',
            overflow: 'hidden',
          },
        },
      }}
    >
      <MapComponent onLocationSelect={onLocationSelect} />
    </Box>
  );
};
