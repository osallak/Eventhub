import { LoadingOverlay } from '@common/components/LoadingOverlay';
import useApi from '@common/hooks/useApi';
import { Topbar } from '@common/layout/Topbar';
import { EventCard } from '@modules/events/components/discover/EventCard';
import { EventFilters, EventFiltersData } from '@modules/events/components/discover/EventFilters';
import { getEvents } from '@modules/events/services/eventService';
import { Event } from '@modules/events/types/event';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useAuth from '@modules/auth/hooks/useAuth';

const searchFieldStyles = {
  '& .MuiOutlinedInput-root': {
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
  },
};

const FiltersContent = ({
  showTitle,
  filters,
  setFilters,
  onApply,
}: {
  showTitle?: boolean;
  filters: EventFiltersData;
  setFilters: (filters: EventFiltersData) => void;
  onApply?: () => void;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showTitle && (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Filters
        </Typography>
      )}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <EventFilters filters={filters} onFilterChange={setFilters} />
      </Box>
      {onApply && (
        <Button
          fullWidth
          variant="contained"
          onClick={onApply}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Apply Filters
        </Button>
      )}
    </Box>
  );
};

const DiscoverEvents = () => {
  const { user } = useAuth();
  const [_showCustomDate, _setShowCustomDate] = useState(false);
  const [_selectedDateOption, _setSelectedDateOption] = useState('upcoming');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { category } = router.query;
  const fetchApi = useApi();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize filters with category from URL if present
  const [filters, setFilters] = useState<EventFiltersData>({
    category: category as string | undefined,
    eventType: undefined,
    isPaid: undefined,
    minAge: undefined,
    city: undefined,
    date: null,
  });

  // Update filters when URL query changes
  useEffect(() => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: category as string,
      }));
    }
  }, [category]);

  // Fetch events only once on mount
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEvents(fetchApi, {
        page: 1,
        per_page: 100,
      });
      setAllEvents(response.data as unknown as Event[]);
    } catch (error) {
      enqueueSnackbar(t('Failed to fetch events'), { variant: 'error' });
      setAllEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi, enqueueSnackbar, t]);

  useEffect(() => {
    fetchEvents();
  }, []); // Only run on mount

  // Memoize filtered results
  const filteredResults = useMemo(() => {
    let result = [...allEvents];

    if (searchTerm.trim()) {
      // Only filter if search term is not empty
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.category) {
      result = result.filter(
        (event) => event.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.eventType) {
      result = result.filter((event) => event.eventType === filters.eventType);
    }

    if (filters.isPaid !== undefined) {
      result = result.filter((event) => event.isPaid === filters.isPaid);
    }

    if (filters.minAge) {
      const minAgeValue = filters.minAge;
      result = result.filter((event) => (event.minAge || 0) >= minAgeValue);
    }

    if (filters.city?.trim()) {
      const cityLower = filters.city.trim().toLowerCase();
      result = result.filter((event) => {
        const eventCity = event.city || '';
        return eventCity.toLowerCase().includes(cityLower);
      });
    }

    return result;
  }, [allEvents, searchTerm, filters]);

  // Simple search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (page !== 1) {
      setPage(1); // Reset page only if not on first page
    }
  };

  // Update pagination
  useEffect(() => {
    const startIndex = (page - 1) * 10;
    setFilteredEvents(filteredResults.slice(startIndex, startIndex + 10));
    setTotalPages(Math.ceil(filteredResults.length / 10));
  }, [filteredResults, page]);

  const handleFilterChange = (newFilters: EventFiltersData) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  return (
    <Box>
      <Topbar isLandingPage={false} scrollProgress={1} />
      {/* Main Container */}
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'background.default',
        }}
      >
        {/* Desktop Filters - Hidden on mobile */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: 280,
            flexShrink: 0,
            ml: { lg: 8 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1],
            position: 'sticky',
            top: 88,
            p: 3,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
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
          }}
        >
          <FiltersContent showTitle filters={filters} setFilters={handleFilterChange} />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: {
              xs: 2,
              sm: 4,
              lg: 8,
            },
            mt: {
              xs: '48px',
              sm: '72px',
              lg: '12px',
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
            Discover Events
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
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="inherit" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                ...searchFieldStyles,
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
                display: { xs: 'none', md: 'flex', lg: 'none' },
                color: 'text.primary',
                borderColor: 'divider',
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Events Grid */}
          {isLoading ? (
            <LoadingOverlay />
          ) : (
            <>
              {filteredEvents.length > 0 ? (
                <>
                  <Grid container spacing={3}>
                    {filteredEvents.map((event) => {
                      const isOwner = event.creator?.id === user?.data?.id;
                      return (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                          <EventCard event={event} isOwner={!!isOwner} />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 4,
                    borderRadius: 4,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
                    border: '1px dashed',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    No Events Found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                    {searchTerm || Object.values(filters).some(Boolean)
                      ? "We couldn't find any events matching your search criteria. Try adjusting your filters or search terms."
                      : 'There are no events available at the moment. Check back later or create your own event!'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/events/create')}
                    sx={{ px: 4 }}
                  >
                    Create Event
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Filter Button - Only show on smaller devices */}
      <Box
        sx={{
          display: { xs: 'block', lg: 'none' },
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
          Show Filtersssss
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
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Filtersssss
            </Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              pt: 2,
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <FiltersContent
              showTitle={false}
              filters={filters}
              setFilters={handleFilterChange}
              onApply={() => setMobileFiltersOpen(false)}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export const getStaticProps = async () => ({
  props: {},
});

export default DiscoverEvents;
