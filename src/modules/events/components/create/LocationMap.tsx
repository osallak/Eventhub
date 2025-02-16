import { Box, TextField, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <Paper
      sx={{
        height: 400,
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
  onLocationSelect: (location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: [number, number];
  }) => void;
}

export const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  return <MapComponent onLocationSelect={onLocationSelect} />;
};
