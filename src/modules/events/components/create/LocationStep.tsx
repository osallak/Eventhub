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

interface LocationStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
}

export const LocationStep = ({ formData, onFormChange }: LocationStepProps) => {
  const { t } = useTranslation();

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
              <Paper
                sx={{
                  height: 200,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                {t('Map Component Will Be Added Here')}
              </Paper>
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
