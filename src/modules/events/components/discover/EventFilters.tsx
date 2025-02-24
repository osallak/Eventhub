import RefreshIcon from '@mui/icons-material/Refresh';
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
import { EVENT_CATEGORIES } from '../../../../constants/categories';
import { DateSelector } from '../create/DateSelector';

export interface EventFiltersData {
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
      borderColor: 'primary.main',
    },
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
      borderWidth: '1px',
    },
  },
  '& + .MuiInputLabel-root': {
    '&.MuiInputLabel-shrink': {
      top: 0,
    },
  },
};

// For TextField components, wrap with the root class
const textFieldStyles = {
  '& .MuiOutlinedInput-root': inputStyles,
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const EventFilters = ({ filters, onFilterChange }: EventFiltersProps) => {
  const handleChange = (newFilters: Partial<EventFiltersData>) => {
    onFilterChange({
      ...filters,
      ...newFilters,
    });
  };

  const handleReset = () => {
    const resetFilters: EventFiltersData = {
      category: undefined,
      eventType: undefined,
      isPaid: undefined,
      minAge: undefined,
      city: undefined,
      date: null,
    };
    onFilterChange(resetFilters);
  };

  return (
    <Stack spacing={3}>
      {/* Category */}
      <FormControl fullWidth>
        <InputLabel
          id="category-label"
          sx={{
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -8px) scale(0.75)',
            },
          }}
        >
          Category
        </InputLabel>
        <Select
          labelId="category-label"
          value={filters.category || ''}
          label="Category"
          onChange={(e) => handleChange({ category: e.target.value })}
          sx={inputStyles}
        >
          <MenuItem value="">All Categories</MenuItem>
          {[
            { label: 'Music', value: EVENT_CATEGORIES.MUSIC },
            { label: 'Art', value: EVENT_CATEGORIES.ART },
            { label: 'Sports', value: EVENT_CATEGORIES.SPORTS },
            { label: 'Tech', value: EVENT_CATEGORIES.TECHNOLOGY },
            { label: 'Food', value: EVENT_CATEGORIES.FOOD },
            { label: 'Business', value: EVENT_CATEGORIES.BUSINESS },
          ].map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {capitalizeFirstLetter(category.value)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Event Type */}
      <FormControl fullWidth>
        <InputLabel
          id="event-type-label"
          sx={{
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -8px) scale(0.75)',
            },
          }}
        >
          Event Type
        </InputLabel>
        <Select
          labelId="event-type-label"
          value={filters.eventType || ''}
          label="Event Type"
          onChange={(e) => handleChange({ eventType: e.target.value })}
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
        value={filters.city || ''}
        onChange={(e) => handleChange({ city: e.target.value })}
        sx={textFieldStyles}
      />

      {/* Price Filter */}
      <Stack direction="row" spacing={1}>
        <Chip
          label="Free"
          clickable
          variant={filters.isPaid === false ? 'filled' : 'outlined'}
          color={filters.isPaid === false ? 'success' : 'default'}
          onClick={() => handleChange({ isPaid: filters.isPaid === false ? undefined : false })}
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
        <Chip
          label="Paid"
          clickable
          variant={filters.isPaid === true ? 'filled' : 'outlined'}
          color={filters.isPaid === true ? 'success' : 'default'}
          onClick={() => handleChange({ isPaid: filters.isPaid === true ? undefined : true })}
          sx={{ flex: 1, height: 40, borderRadius: '20px' }}
        />
      </Stack>

      {/* Minimum Age */}
      <TextField
        fullWidth
        type="number"
        label="Age Requirement"
        placeholder="Minimum age..."
        value={filters.minAge || ''}
        onChange={(e) =>
          handleChange({ minAge: e.target.value ? Number(e.target.value) : undefined })
        }
        InputProps={{ inputProps: { min: 0 } }}
        sx={textFieldStyles}
      />

      {/* Date Filter */}
      <DateSelector
        selectedDate={filters.date}
        onDateChange={(newDate) => handleChange({ date: newDate })}
        label="Date"
      />

      {/* Buttons */}
      <Button startIcon={<RefreshIcon />} onClick={handleReset} sx={{ textTransform: 'none' }}>
        Reset Filters
      </Button>
    </Stack>
  );
};
