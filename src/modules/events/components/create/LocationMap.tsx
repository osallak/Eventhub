import { Box, TextField, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

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
}

export const LocationMap = ({ address, city, onLocationSelect }: LocationMapProps) => {
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
