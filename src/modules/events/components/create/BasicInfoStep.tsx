import { Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../types/form';

interface BasicInfoStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
}

export const BasicInfoStep = ({ formData, onFormChange }: BasicInfoStepProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('Event Title')}
            value={formData.title || ''}
            onChange={(e) => onFormChange('title', e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('Category')}</InputLabel>
            <Select
              value={formData.category || ''}
              label={t('Category')}
              onChange={(e) => onFormChange('category', e.target.value)}
            >
              <MenuItem value="sports">{t('Sports & Fitness')}</MenuItem>
              <MenuItem value="music">{t('Music & Concerts')}</MenuItem>
              <MenuItem value="education">{t('Education')}</MenuItem>
              <MenuItem value="business">{t('Business')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('Description')}
            value={formData.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}; 