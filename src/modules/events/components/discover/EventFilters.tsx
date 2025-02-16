import { Button, Chip, FormControl, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);

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
        <Select
          value={localFilters.category || ''}
          displayEmpty
          onChange={(e) => handleLocalChange({ category: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">{t('Category')}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {t(category)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Event Type */}
      <FormControl fullWidth>
        <Select
          value={localFilters.eventType || ''}
          displayEmpty
          onChange={(e) => handleLocalChange({ eventType: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">{t('Event Type')}</MenuItem>
          <MenuItem value="physical">{t('In Person')}</MenuItem>
          <MenuItem value="virtual">{t('Virtual')}</MenuItem>
          <MenuItem value="hybrid">{t('Hybrid')}</MenuItem>
        </Select>
      </FormControl>

      {/* City */}
      <TextField
        fullWidth
        placeholder={t('City')}
        value={localFilters.city || ''}
        onChange={(e) => handleLocalChange({ city: e.target.value })}
        sx={textFieldStyles}
      />

      {/* Price Filter */}
      <Stack direction="row" spacing={1}>
        <Chip
          label={t('Free')}
          clickable
          variant={localFilters.isPaid === false ? 'filled' : 'outlined'}
          color={localFilters.isPaid === false ? 'success' : 'default'}
          onClick={() =>
            handleLocalChange({ isPaid: localFilters.isPaid === false ? undefined : false })
          }
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
        <Chip
          label={t('Paid')}
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
        placeholder={t('Minimum Age')}
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
        label={t('Event Date')}
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
        {t('Apply Filters')}
      </Button>
    </Stack>
  );
};
