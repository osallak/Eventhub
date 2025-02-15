import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DateTimeStepProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
}

export const DateTimeStep = ({ formData, onFormChange }: DateTimeStepProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Event Date */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label={t('Event Date')}
            value={formData.date || ''}
            onChange={(e) => onFormChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
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

        {/* Time Slots */}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label={t('Start Time')}
                value={formData.startTime || ''}
                onChange={(e) => onFormChange('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label={t('End Time')}
                value={formData.endTime || ''}
                onChange={(e) => onFormChange('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Duration Settings */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('Duration')}</InputLabel>
            <Select
              value={formData.duration || ''}
              label={t('Duration')}
              onChange={(e) => onFormChange('duration', e.target.value)}
            >
              <MenuItem value="30">30 {t('minutes')}</MenuItem>
              <MenuItem value="60">1 {t('hour')}</MenuItem>
              <MenuItem value="90">1.5 {t('hours')}</MenuItem>
              <MenuItem value="120">2 {t('hours')}</MenuItem>
              <MenuItem value="custom">{t('Custom')}</MenuItem>
            </Select>
            <FormHelperText>{t('Select event duration')}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Recurring Options */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('Repeat')}</InputLabel>
            <Select
              value={formData.recurring || ''}
              label={t('Repeat')}
              onChange={(e) => onFormChange('recurring', e.target.value)}
            >
              <MenuItem value="none">{t('Does not repeat')}</MenuItem>
              <MenuItem value="daily">{t('Daily')}</MenuItem>
              <MenuItem value="weekly">{t('Weekly')}</MenuItem>
              <MenuItem value="monthly">{t('Monthly')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Time Zone */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>{t('Time Zone')}</InputLabel>
            <Select
              value={formData.timezone || ''}
              label={t('Time Zone')}
              onChange={(e) => onFormChange('timezone', e.target.value)}
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="EST">EST (UTC-5)</MenuItem>
              <MenuItem value="CST">CST (UTC-6)</MenuItem>
              <MenuItem value="PST">PST (UTC-8)</MenuItem>
              {/* Add more time zones as needed */}
            </Select>
            <FormHelperText>{t('Select event time zone')}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}; 