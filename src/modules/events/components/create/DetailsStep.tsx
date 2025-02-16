import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categories } from '../../../../constants/categories';
import { EventFormData } from '../../types/form';

interface DetailsStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const DetailsStep = ({ formData, onFormChange }: DetailsStepProps) => {
  const { t } = useTranslation();
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

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Capacity Settings */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('Maximum Participants')}
            value={formData.maxParticipants || ''}
            onChange={(e) => onFormChange('maxParticipants', e.target.value)}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('Experience Level')}</InputLabel>
            <Select
              value={formData.experienceLevel || ''}
              label={t('Experience Level')}
              onChange={(e) => onFormChange('experienceLevel', e.target.value)}
            >
              <MenuItem value="beginner">{t('Beginner')}</MenuItem>
              <MenuItem value="intermediate">{t('Intermediate')}</MenuItem>
              <MenuItem value="advanced">{t('Advanced')}</MenuItem>
              <MenuItem value="all">{t('All Levels')}</MenuItem>
            </Select>
          </FormControl>
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
          />
        </Grid>

        {/* Price Settings */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('Price')}
            value={formData.price || ''}
            onChange={(e) => onFormChange('price', e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 0.01 },
              startAdornment: '€',
            }}
          />
        </Grid>

        {/* Equipment Required */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.equipmentRequired || false}
                onChange={(e) => onFormChange('equipmentRequired', e.target.checked)}
              />
            }
            label={t('Equipment Required')}
          />
        </Grid>

        {formData.equipmentRequired && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('Equipment Details')}
              value={formData.equipmentDetails || ''}
              onChange={(e) => onFormChange('equipmentDetails', e.target.value)}
              placeholder={t('List required equipment...')}
            />
          </Grid>
        )}

        {/* Rules and Guidelines */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary' }}>
            {t('Rules and Guidelines')}
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label={t('Add Rule')}
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
              />
              <IconButton
                onClick={handleAddRule}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {(formData.rules || []).map((rule: string, index: number) => (
                <Chip
                  key={index}
                  label={rule}
                  onDelete={() => handleRemoveRule(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
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
