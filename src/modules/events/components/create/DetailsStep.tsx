import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../types/form';
import { getInputStyles } from './styles/inputStyles';

interface DetailsStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
}

export const DetailsStep = ({ formData, onFormChange }: DetailsStepProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const inputStyles = getInputStyles(theme);
  const [newRule, setNewRule] = useState('');

  const handleAddRule = () => {
    if (newRule.trim()) {
      const updatedRules = [...(formData.rules || []), newRule.trim()];
      onFormChange('rules', updatedRules);
      setNewRule('');
    }
  };

  const handleRemoveRule = (indexToRemove: number) => {
    const updatedRules = (formData.rules || []).filter((_, index) => index !== indexToRemove);
    onFormChange('rules', updatedRules);
  };

  // Add this style object
  const disabledInputStyles = {
    ...inputStyles,
    '& .MuiOutlinedInput-root': {
      ...inputStyles['& .MuiOutlinedInput-root'],
      '&.Mui-disabled': {
        '& fieldset': {
          borderColor: 'divider',
        },
        '&:hover fieldset': {
          borderColor: 'divider',
        },
      },
    },
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Capacity Settings */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('Maximum Participants')}
            value={formData.maxParticipants > 0 ? formData.maxParticipants : ''}
            onChange={(e) => {
              const value = e.target.value;
              onFormChange('maxParticipants', value === '' ? -1 : Number(value));
            }}
            placeholder={t('Leave empty for unlimited')}
            InputProps={{ inputProps: { min: 1 } }}
            sx={inputStyles}
          />
        </Grid>

        {/* Age Restrictions */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('Minimum Age')}
            value={formData.minAge || ''}
            onChange={(e) => onFormChange('minAge', e.target.value)}
            InputProps={{ inputProps: { min: 0 } }}
            sx={inputStyles}
          />
        </Grid>

        {/* Price Settings */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPaid || false}
                onChange={(e) => onFormChange('isPaid', e.target.checked)}
                color="primary"
              />
            }
            label={t('This is a paid event')}
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('Price')}
                value={formData.price || ''}
                onChange={(e) => onFormChange('price', e.target.value)}
                disabled={!formData.isPaid}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                }}
                sx={disabledInputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t('Currency')}
                value={formData.currency || ''}
                onChange={(e) => onFormChange('currency', e.target.value)}
                disabled={!formData.isPaid}
                sx={disabledInputStyles}
              >
                {/* Use common currencies based on user's locale */}
                {[
                  { code: 'USD', symbol: '$' },
                  { code: 'EUR', symbol: '€' },
                  { code: 'GBP', symbol: '£' },
                ].map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {`${currency.code} (${currency.symbol})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* Rules and Guidelines */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={t('Add Rule')}
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleAddRule}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      mr: -1,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
              sx={inputStyles}
            />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{
              gap: 1,
              '& > *': {
                margin: '4px !important',
              },
            }}
          >
            {(formData.rules || []).map((rule, index) => (
              <Chip
                key={index}
                label={rule}
                onDelete={() => handleRemoveRule(index)}
                sx={{ bgcolor: 'background.paper' }}
              />
            ))}
          </Stack>
        </Grid>

        {/* Additional Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('Additional Notes')}
            value={formData.notes || ''}
            onChange={(e) => onFormChange('notes', e.target.value)}
            placeholder={t('Any additional information for participants...')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
