import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { categories } from '../../../../constants/categories';
import { DateSelector } from '../create/DateSelector';

interface EventFiltersProps {
  filters: {
    category?: string;
    eventType?: string;
    isPaid?: boolean;
    minAge?: number;
    city?: string;
    date: Date | null;
  };
  onFilterChange: (filters: any) => void;
}

const inputStyles = {
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'divider',
  },
  '&:hover': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'success.main',
    },
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'success.main',
      borderWidth: '1px',
    },
  },
};

// For TextField components, wrap with the root class
const textFieldStyles = {
  '& .MuiOutlinedInput-root': inputStyles,
};

export const EventFilters = ({ filters, onFilterChange }: EventFiltersProps) => {
  const { t } = useTranslation('events', {
    useSuspense: false,
  });
  const [localFilters, setLocalFilters] = useState(filters);

  // Debug translations
  console.log('Filter translations:', {
    locationLabel: t('filters.location.label'),
    locationPlaceholder: t('filters.location.placeholder'),
    ageLabel: t('filters.age.label'),
    agePlaceholder: t('filters.age.placeholder'),
    dateLabel: t('filters.date.label'),
    datePlaceholder: t('filters.date.placeholder'),
  });

  const handleLocalChange = (newFilters: Partial<typeof filters>) => {
    setLocalFilters({ ...localFilters, ...newFilters });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  return (
    <Stack spacing={3}>
      {/* Category */}
      <FormControl fullWidth>
        <InputLabel>{t('filters.category.label')}</InputLabel>
        <Select
          value={localFilters.category || ''}
          displayEmpty
          onChange={(e) => handleLocalChange({ category: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">{t('filters.category.all')}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {t(`categories.${category.toLowerCase()}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Event Type */}
      <FormControl fullWidth>
        <InputLabel>{t('filters.type.label')}</InputLabel>
        <Select
          value={localFilters.eventType || ''}
          displayEmpty
          onChange={(e) => handleLocalChange({ eventType: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">{t('filters.type.all')}</MenuItem>
          <MenuItem value="physical">{t('filters.type.physical')}</MenuItem>
          <MenuItem value="virtual">{t('filters.type.virtual')}</MenuItem>
          <MenuItem value="hybrid">{t('filters.type.hybrid')}</MenuItem>
        </Select>
      </FormControl>

      {/* City */}
      <TextField
        fullWidth
        label={t('filters.location.label')}
        placeholder={t('filters.location.placeholder')}
        value={localFilters.city || ''}
        onChange={(e) => handleLocalChange({ city: e.target.value })}
        sx={textFieldStyles}
      />

      {/* Price Filter */}
      <Stack direction="row" spacing={1}>
        <Chip
          label={t('filters.price.free')}
          clickable
          variant={localFilters.isPaid === false ? 'filled' : 'outlined'}
          color={localFilters.isPaid === false ? 'success' : 'default'}
          onClick={() =>
            handleLocalChange({ isPaid: localFilters.isPaid === false ? undefined : false })
          }
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
        <Chip
          label={t('filters.price.paid')}
          clickable
          variant={localFilters.isPaid === true ? 'filled' : 'outlined'}
          color={localFilters.isPaid === true ? 'success' : 'default'}
          onClick={() =>
            handleLocalChange({ isPaid: localFilters.isPaid === true ? undefined : true })
          }
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
      </Stack>

      {/* Minimum Age */}
      <TextField
        fullWidth
        type="number"
        label={t('filters.age.label')}
        placeholder={t('filters.age.placeholder')}
        value={localFilters.minAge || ''}
        onChange={(e) =>
          handleLocalChange({ minAge: e.target.value ? Number(e.target.value) : undefined })
        }
        InputProps={{ inputProps: { min: 0 } }}
        sx={textFieldStyles}
      />

      {/* Date Filter */}
      <DateSelector
        selectedDate={localFilters.date}
        onDateChange={(newDate) => handleLocalChange({ date: newDate })}
        label={t('filters.date.label')}
      />

      {/* Apply Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleApply}
        sx={{
          borderRadius: '20px',
          py: 1.5,
          mt: 2,
        }}
      >
        {t('filters.apply')}
      </Button>
    </Stack>
  );
};
