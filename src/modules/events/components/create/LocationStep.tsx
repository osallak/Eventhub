import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../types/form';
import { LocationMap } from './LocationMap';
import { useEffect, useState } from 'react';

interface LocationStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
}

export const LocationStep = ({ formData, onFormChange }: LocationStepProps) => {
  const { t } = useTranslation();

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: [number, number];
  }) => {
    console.group('LocationStep: Location Update');
    console.log('Received location from MapComponent:', location);

    // Update all fields at once
    const updates = {
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      coordinates: location.coordinates,
      // Keep existing event type
      eventType: formData.eventType || 'physical',
    };

    console.log('Current form data:', formData);
    console.log('Preparing updates:', updates);

    // Update each field individually to ensure state updates
    Object.entries(updates).forEach(([field, value]) => {
      console.log(`Updating field "${field}":`, value);
      onFormChange(field as keyof EventFormData, value);
    });
    console.groupEnd();
  };

  // Track form data changes
  useEffect(() => {
    const locationFields = {
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      coordinates: formData.coordinates,
    };

    const isValid = Boolean(
      locationFields.coordinates && locationFields.address && locationFields.city
    );

    console.group('LocationStep: Validation');
    console.log('Current fields:', locationFields);
    console.log('Validation:', {
      hasAddress: Boolean(locationFields.address),
      hasCity: Boolean(locationFields.city),
      hasCoordinates: Boolean(locationFields.coordinates),
      isValid,
    });
    console.groupEnd();
  }, [formData]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Event Type Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>{t('Event Type')}</InputLabel>
            <Select
              value={formData.eventType || 'physical'}
              label={t('Event Type')}
              onChange={(e) => onFormChange('eventType', e.target.value)}
            >
              <MenuItem value="physical">{t('In-Person Event')}</MenuItem>
              <MenuItem value="virtual">{t('Virtual Event')}</MenuItem>
              <MenuItem value="hybrid">{t('Hybrid Event')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Physical Location Fields */}
        {(formData.eventType === 'physical' || formData.eventType === 'hybrid') && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('Venue Name')}
                value={formData.venueName || ''}
                onChange={(e) => onFormChange('venueName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('Street Address')}
                value={formData.address || ''}
                onChange={(e) => onFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('City')}
                value={formData.city || ''}
                onChange={(e) => onFormChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('Postal Code')}
                value={formData.postalCode || ''}
                onChange={(e) => onFormChange('postalCode', e.target.value)}
              />
            </Grid>
            {/* Map Component Placeholder */}
            <Grid item xs={12}>
              <LocationMap onLocationSelect={handleLocationSelect} />
            </Grid>
          </>
        )}

        {/* Virtual Location Fields */}
        {(formData.eventType === 'virtual' || formData.eventType === 'hybrid') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('Meeting Link')}
              value={formData.meetingLink || ''}
              onChange={(e) => onFormChange('meetingLink', e.target.value)}
              helperText={t('Add your virtual meeting link (Zoom, Google Meet, etc.)')}
            />
          </Grid>
        )}

        {/* Additional Options */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.hideAddress || false}
                onChange={(e) => onFormChange('hideAddress', e.target.checked)}
              />
            }
            label={t('Hide exact address until registration')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
