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
import { useState } from 'react';
import { categories } from '../../../../constants/categories';
import { DateSelector } from '../create/DateSelector';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface EventFiltersData {
  search: string;
  category?: string;
  eventType?: string;
  isPaid?: boolean;
  minAge?: number;
  city?: string;
  date: Date | null;
}

interface EventFiltersProps {
  filters: EventFiltersData;
  onFilterChange: (filters: EventFiltersData) => void;
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
  const [localFilters, setLocalFilters] = useState(filters);

  const handleLocalChange = (newFilters: Partial<typeof filters>) => {
    setLocalFilters({ ...localFilters, ...newFilters });
  };

  const handleReset = () => {
    const resetFilters: EventFiltersData = {
      search: '',
      category: undefined,
      eventType: undefined,
      isPaid: undefined,
      minAge: undefined,
      city: undefined,
      date: null,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  return (
    <Stack spacing={3}>
      {/* Category */}
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={localFilters.category || ''}
          label="Category"
          onChange={(e) => handleLocalChange({ category: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Event Type */}
      <FormControl fullWidth>
        <InputLabel id="event-type-label">Event Type</InputLabel>
        <Select
          labelId="event-type-label"
          value={localFilters.eventType || ''}
          label="Event Type"
          onChange={(e) => handleLocalChange({ eventType: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="physical">In Person</MenuItem>
          <MenuItem value="virtual">Online</MenuItem>
          <MenuItem value="hybrid">Hybrid</MenuItem>
        </Select>
      </FormControl>

      {/* City */}
      <TextField
        fullWidth
        label="Location"
        placeholder="Enter location..."
        value={localFilters.city || ''}
        onChange={(e) => handleLocalChange({ city: e.target.value })}
        sx={textFieldStyles}
      />

      {/* Price Filter */}
      <Stack direction="row" spacing={1}>
        <Chip
          label="Free"
          clickable
          variant={localFilters.isPaid === false ? 'filled' : 'outlined'}
          color={localFilters.isPaid === false ? 'success' : 'default'}
          onClick={() =>
            handleLocalChange({ isPaid: localFilters.isPaid === false ? undefined : false })
          }
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
        <Chip
          label="Paid"
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
        label="Age Requirement"
        placeholder="Minimum age..."
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
        label="Date"
      />

      {/* Buttons */}
      <Stack spacing={1}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleApply}
          sx={{
            borderRadius: '20px',
            py: 1.5,
          }}
        >
          Apply Filters
        </Button>

        <Button startIcon={<RefreshIcon />} onClick={handleReset} sx={{ textTransform: 'none' }}>
          Reset Filters
        </Button>
      </Stack>
    </Stack>
  );
};
