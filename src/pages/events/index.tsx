import { Topbar } from '@common/layout/Topbar';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
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
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
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
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
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
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
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
      <Topbar isLandingPage={false} scrollProgress={1} />
      {/* Main Container */}
      <Box
        sx={{
          display: 'flex',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'background.default'),
        }}
      >
        {/* Desktop Filters - Hidden on mobile */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 280,
            flexShrink: 0,
            ml: { md: 8 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1],
            height: 'calc(100vh - 100px)',
            position: 'sticky',
            top: 88,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              p: 3,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
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
              color: 'text.primary',
            }}
          >
            Discover events
          </Typography>

          {/* Search and Filter Bar */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search events..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="inherit" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setMobileFiltersOpen(true)}
              sx={{
                display: { md: 'none' },
                color: 'text.primary',
                borderColor: 'divider',
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Events Grid */}
          <Grid container spacing={3}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'background.neutral',
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
                        color: 'success.contrastText',
                      }}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                      Event Title {index + 1}
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {12 + index} Spots left
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Date: Mar {1 + index}, 2024 • 19:00-21:00
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
            borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2,
            borderTopRightRadius: (theme) => theme.shape.borderRadius * 2,
            px: 2,
            py: 3,
          },
        }}
      >
        <Box sx={{ overflowY: 'auto' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
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
