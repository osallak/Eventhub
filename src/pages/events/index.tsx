import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  Drawer,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useState } from 'react';

// Move FiltersContent outside
const FiltersContent = ({
  selectedDateOption,
  setSelectedDateOption,
  showCustomDate,
  setShowCustomDate,
  showTitle,
}: {
  selectedDateOption: string;
  setSelectedDateOption: (value: string) => void;
  showCustomDate: boolean;
  setShowCustomDate: (value: boolean) => void;
  showTitle: boolean;
}) => (
  <>
    {showTitle && (
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Filters
      </Typography>
    )}

    {/* Category Filter */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Category
      </Typography>
      <Stack spacing={1}>
        {[
          'All categories',
          'Music & Concerts',
          'Sports & Fitness',
          'Business & Professional',
          'Food & Drink',
          'Arts & Culture',
          'Community & Charity',
          'Technology',
          'Education',
        ].map((type) => (
          <Box
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              py: 0.5,
              color: 'text.secondary',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Typography variant="body2">{type}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Date & Time */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        When
      </Typography>
      <Stack spacing={2}>
        <TextField
          select
          size="small"
          fullWidth
          value={selectedDateOption}
          onChange={(e) => {
            setSelectedDateOption(e.target.value);
            setShowCustomDate(e.target.value === 'custom');
          }}
        >
          {[
            { value: 'anytime', label: 'Anytime' },
            { value: 'today', label: 'Today' },
            { value: 'tomorrow', label: 'Tomorrow' },
            { value: 'this-week', label: 'This week' },
            { value: 'this-weekend', label: 'This weekend' },
            { value: 'next-week', label: 'Next week' },
            { value: 'next-month', label: 'Next month' },
            { value: 'custom', label: 'Custom date' },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Custom Date Picker */}
        {showCustomDate && (
          <TextField
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      </Stack>
    </Box>

    {/* Event Type */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Event type
      </Typography>
      <Stack spacing={1}>
        {['All types', 'In-person', 'Virtual', 'Hybrid'].map((type) => (
          <Box
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              py: 0.5,
              color: 'text.secondary',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Typography variant="body2">{type}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Additional Filters */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Additional filters
      </Typography>
      <Stack spacing={1}>
        {[
          'Available spots only',
          'Wheelchair accessible',
          'Family friendly',
          'Age restricted',
          'Parking available',
        ].map((filter) => (
          <Box
            key={filter}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              py: 0.5,
              color: 'text.secondary',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Typography variant="body2">{filter}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Reset Filters */}
    <Button startIcon={<RefreshIcon />} sx={{ textTransform: 'none' }} onClick={() => {}}>
      Reset filters
    </Button>
  </>
);

const DiscoverEvents = () => {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState('anytime');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <Box>
      {/* Main Container */}
      <Box sx={{ display: 'flex' }}>
        {/* Desktop Filters - Hidden on mobile */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 280,
            flexShrink: 0,
            ml: { md: 8 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(0,0,0,0.05)',
            p: 3,
            height: 'fit-content',
            position: 'sticky',
            top: 88,
            overflowY: 'auto',
          }}
        >
          <FiltersContent
            selectedDateOption={selectedDateOption}
            setSelectedDateOption={setSelectedDateOption}
            showCustomDate={showCustomDate}
            setShowCustomDate={setShowCustomDate}
            showTitle
          />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: {
              xs: 2,
              sm: 4,
              md: 8,
            },
            mt: {
              xs: '48px',
              sm: '72px',
              md: '12px',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: {
                xs: '1.75rem',
                sm: '2rem',
              },
            }}
          >
            Discover events
          </Typography>

          {/* Events Grid */}
          <Grid
            container
            spacing={3}
            sx={{
              '& .MuiGrid-item': {
                width: {
                  xs: '100%',
                  sm: '50%',
                  lg: '33.333%',
                },
              },
            }}
          >
            {[...Array(9)].map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={index}
                sx={{
                  '& .MuiCard-root': {
                    height: { sm: '100%' },
                  },
                  '& .MuiCardMedia-root': {
                    height: {
                      xs: 200,
                      sm: 240,
                      lg: 200,
                    },
                  },
                  '& .MuiTypography-h6': {
                    fontSize: {
                      xs: '1.25rem',
                      sm: '1.5rem',
                      lg: '1.25rem',
                    },
                  },
                  '& .MuiTypography-body2': {
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                      lg: '0.875rem',
                    },
                  },
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.300',
                      position: 'relative',
                    }}
                  >
                    <Chip
                      label="ANYONE"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'success.main',
                        color: 'white',
                      }}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Event Title {index + 1}
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {12 + index} Spots left
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: Mar {1 + index}, 2024 • 19:00-21:00
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Venue: Event Center {(index % 3) + 1}, City
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Mobile Filter Button - Fixed at bottom */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<FilterIcon />}
          onClick={() => setMobileFiltersOpen(true)}
          sx={{
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: {
            height: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            px: 2,
            py: 3,
          },
        }}
      >
        <Box sx={{ overflowY: 'auto' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FiltersContent
            selectedDateOption={selectedDateOption}
            setSelectedDateOption={setSelectedDateOption}
            showCustomDate={showCustomDate}
            setShowCustomDate={setShowCustomDate}
            showTitle
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default DiscoverEvents;
