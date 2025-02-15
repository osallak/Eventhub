import { AddressAutofill } from '@mapbox/search-js-react';
import { Box, Paper, TextField } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ElementType } from 'react';
import { useEffect, useRef, useState } from 'react';

// Replace with your Mapbox token
mapboxgl.accessToken = (process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '') as string;

interface MapComponentProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: [number, number];
  }) => void;
}

interface MapboxContext {
  id: string;
  text: string;
}

interface SuggestionResponse {
  features: Array<{
    geometry: { coordinates: number[] };
    properties: any;
    context?: Array<{ id: string; text: string }>;
  }>;
}

interface AddressAutofillProps {
  accessToken: string;
  onRetrieve: (response: SuggestionResponse) => void;
  children: React.ReactNode;
}

const AddressAutofillComponent = AddressAutofill as ElementType<AddressAutofillProps>;

const MapComponent = ({ onLocationSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const moveTimeout = useRef<NodeJS.Timeout>();
  const [lng, setLng] = useState(-0.118092);
  const [lat, setLat] = useState(51.509865);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (!mapContainer.current || map.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom,
    });

    marker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    map.current.on('moveend', () => {
      if (!map.current) {
        return;
      }

      const { lng, lat } = map.current.getCenter();
      setLng(lng);
      setLat(lat);
      setZoom(map.current.getZoom());

      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => {
        updateLocation([lng, lat]);
      }, 500);
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      updateLocation([lng, lat]);
    });

    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        updateLocation([lngLat.lng, lngLat.lat]);
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
        });
        marker.current?.setLngLat([longitude, latitude]);
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    return () => {
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, []);

  const updateLocation = async (coordinates: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features?.length > 0) {
        const feature = data.features[0];
        const selectedLocation = {
          address: feature.place_name || '',
          city: feature.context?.find((c: MapboxContext) => c.id.startsWith('place'))?.text || '',
          postalCode:
            feature.context?.find((c: MapboxContext) => c.id.startsWith('postcode'))?.text || '',
          coordinates,
        };
        onLocationSelect(selectedLocation);
      }
    } catch (error) {
      console.error('Error getting location data:', error);
    }
  };

  // Update handler
  const handleAddressSelect = (response: SuggestionResponse) => {
    if (!map.current || !response.features?.[0]) {
      return;
    }

    const feature = response.features[0];
    const coordinates: [number, number] = [
      feature.geometry.coordinates[0],
      feature.geometry.coordinates[1],
    ];

    map.current.flyTo({
      center: coordinates,
      zoom: 15,
    });
    marker.current?.setLngLat(coordinates);

    const selectedLocation = {
      address: feature.properties.full_address || feature.properties.address || '',
      city: feature.context?.find((c: MapboxContext) => c.id.startsWith('place'))?.text || '',
      postalCode:
        feature.context?.find((c: MapboxContext) => c.id.startsWith('postcode'))?.text || '',
      coordinates,
    };

    onLocationSelect(selectedLocation);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <form>
        <AddressAutofillComponent
          accessToken={mapboxgl.accessToken!}
          onRetrieve={handleAddressSelect}
        >
          <TextField
            fullWidth
            placeholder="Search address..."
            sx={{ mb: 2 }}
            autoComplete="address-line1"
          />
        </AddressAutofillComponent>
      </form>

      <Paper
        ref={mapContainer}
        sx={{
          height: 400,
          width: '100%',
          bgcolor: 'background.neutral',
          '& .mapboxgl-canvas': {
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
};

export default MapComponent;
