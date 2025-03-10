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
import { useTheme } from '@mui/material/styles';
import { EventFormData } from '../../types/form';
import { LocationMap } from './LocationMap';
import { useEffect, useState } from 'react';
import { getInputStyles } from './styles/inputStyles';

interface LocationStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const LocationStep = ({ formData, onFormChange, onValidationChange }: LocationStepProps) => {
  const theme = useTheme();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputStyles = getInputStyles(theme);

  // Initialize event type to physical if not set
  useEffect(() => {
    if (!formData.eventType) {
      onFormChange('eventType', 'physical');
    }
  }, []);

  // Add URL validation helper
  const isValidUrl = (url: string) => {
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  // Update validation function
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (formData.eventType === 'physical' || formData.eventType === 'hybrid') {
      if (!formData.venueName?.trim()) {
        newErrors.venueName = 'Venue name is required';
        isValid = false;
      }
      if (!formData.address?.trim()) {
        newErrors.address = 'Address is required';
        isValid = false;
      }
      if (!formData.city?.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      }
    }

    if (formData.eventType === 'virtual' || formData.eventType === 'hybrid') {
      if (!formData.meetingLink?.trim()) {
        newErrors.meetingLink = 'Meeting link is required';
        isValid = false;
      } else if (!isValidUrl(formData.meetingLink)) {
        newErrors.meetingLink = 'Please enter a valid URL';
        isValid = false;
      }
    }

    setErrors(newErrors);
    onValidationChange(isValid);
    return isValid;
  };

  // Validate on form changes
  useEffect(() => {
    validateFields();
  }, [formData]);

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: [number, number];
  }) => {
    // Update all location fields when map selection changes
    onFormChange('address', location.address);
    onFormChange('city', location.city);
    onFormChange('postalCode', location.postalCode);
    onFormChange('coordinates', location.coordinates);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Event Type Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={formData.eventType || ''}
              label="Event Type"
              onChange={(e) => onFormChange('eventType', e.target.value)}
              sx={inputStyles}
            >
              <MenuItem value="physical">Physical</MenuItem>
              <MenuItem value="virtual">Virtual</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Virtual Event Fields */}
        {(formData.eventType === 'virtual' || formData.eventType === 'hybrid') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meeting Link"
              value={formData.meetingLink || ''}
              onChange={(e) => onFormChange('meetingLink', e.target.value)}
              error={!!errors.meetingLink}
              helperText={errors.meetingLink}
              required
              sx={inputStyles}
            />
          </Grid>
        )}

        {/* Physical Location Fields */}
        {(formData.eventType === 'physical' || formData.eventType === 'hybrid') && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue Name"
                value={formData.venueName || ''}
                onChange={(e) => onFormChange('venueName', e.target.value)}
                error={!!errors.venueName}
                helperText={errors.venueName}
                required
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address || ''}
                onChange={(e) => onFormChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                required
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city || ''}
                onChange={(e) => onFormChange('city', e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
                required
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postalCode || ''}
                onChange={(e) => onFormChange('postalCode', e.target.value)}
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hideAddress || false}
                    onChange={(e) => onFormChange('hideAddress', e.target.checked)}
                    color="primary"
                  />
                }
                label="Hide exact address from public view"
                sx={{
                  color: 'text.secondary',
                  '& .MuiSwitch-root': {
                    mr: 1,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  '& > div': {
                    maxWidth: '100%',
                  },
                }}
              >
                <LocationMap
                  address={formData.address}
                  city={formData.city}
                  onLocationSelect={handleLocationSelect}
                />
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
