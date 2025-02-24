import useApi from '@common/hooks/useApi';
import { Topbar } from '@common/layout/Topbar';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { EventCard } from '@modules/events/components/discover/EventCard';
import { getEvents } from '@modules/events/services/eventService';
import { Event } from '@modules/events/types/event';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { menuItems } from '../common/defs/menu-items';
import { EVENT_CATEGORIES } from '../constants/categories';
import type { PageComponent } from './_app';

const Home: PageComponent = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchApi = useApi();
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await getEvents(fetchApi, {
          page: 1,
          per_page: 6, // Show fewer events on home page
        });
        setEvents(response.data as unknown as Event[]);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEvents();
  }, []);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await getEvents(fetchApi, {
          page: 1,
          per_page: 5, // Fetch 5 events for the scroll
        });
        setPopularEvents(response.data as unknown as Event[]);
      } catch (error) {}
    };

    fetchPopularEvents();
  }, [fetchApi]);

  const renderYourEventsSection = () => {
    if (!isAuthenticated) {
      return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                borderRadius: 4,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
                border: '1px dashed',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'),
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                Log in to See Your Events
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                Join our community to track your events, manage registrations, and connect with
                other event enthusiasts.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/auth/login')}
                  sx={{ px: 4 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/auth/register')}
                  sx={{ px: 4 }}
                >
                  Create Account
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      );
    }

    // For logged-in users with no events
    const hasEvents = false; // This will be replaced with real data check later

    // if (!hasEvents) {
    //   return (
    //     <Box sx={{ py: 8, bgcolor: 'background.default' }}>
    //       <Container maxWidth="lg">
    //         <Box
    //           sx={{
    //             textAlign: 'center',
    //             py: 8,
    //             px: 4,
    //             borderRadius: 4,
    //             bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
    //             border: '1px dashed',
    //             borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'),
    //           }}
    //         >
    //           <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
    //             No Events Yet
    //           </Typography>
    //           <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
    //             Start your journey by creating your first event or join existing ones.
    //           </Typography>
    //           <Stack
    //             direction={{ xs: 'column', sm: 'row' }}
    //             spacing={2}
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Button
    //               variant="contained"
    //               size="large"
    //               onClick={() => router.push('/events/create')}
    //               sx={{ px: 4 }}
    //             >
    //               Create Event
    //             </Button>
    //             <Button
    //               variant="outlined"
    //               size="large"
    //               onClick={() => router.push('/events')}
    //               sx={{ px: 4 }}
    //             >
    //               Discover Events
    //             </Button>
    //           </Stack>
    //         </Box>
    //       </Container>
    //     </Box>
    //   );
    // }

    // Return the events list for logged-in users with events
    // return (
    //   <Box sx={{ py: 8, bgcolor: 'background.default' }}>
    //     <Container maxWidth={false}>
    //       <Typography
    //         variant="h4"
    //         sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 }, color: 'text.primary' }}
    //       >
    //         Your events
    //       </Typography>
    //       <Grid container spacing={3}>
    //         {isLoading ? (
    //           <LoadingOverlay />
    //         ) : (
    //           events.map((event) => (
    //             <Grid item xs={12} sm={6} md={4} key={event.id}>
    //               <EventCard event={event} />
    //             </Grid>
    //           ))
    //         )}
    //       </Grid>
    //     </Container>
    //   </Box>
    // );
  };

  return (
    <Box>
      <Topbar isLandingPage scrollProgress={scrollProgress} />
      <Box sx={{ margin: 0, padding: 0 }}>
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: { xs: '80vh', md: '90vh' },
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("/images/hero-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: '-72px',
            paddingTop: { xs: '48px', sm: '64px' },
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              px: { xs: 2, sm: 4, md: 8 },
              maxWidth: '1800px',
              mx: 'auto',
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={8} lg={6}>
                <Stack spacing={{ xs: 3, md: 4 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Book events.
                    <br />
                    Find venues.
                    <br />
                    Connect.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#fff',
                      opacity: 0.9,
                      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                      maxWidth: '600px',
                      lineHeight: 1.5,
                    }}
                  >
                    All-in-one platform for event lovers. Find and create events.
                    <br />
                    Join communities. Make memories.
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 3 }}
                    sx={{
                      mt: { xs: 2, sm: 3 },
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                    }}
                  >
                    {menuItems
                      .filter((item) => item.id === 'discover')
                      .map((item) => (
                        <Button
                          key={item.id}
                          variant="contained"
                          size="large"
                          onClick={() => router.push(item.link)}
                          sx={{
                            py: 1.4,
                            px: { xs: 2.5, sm: 4 },
                            borderRadius: '8px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            backgroundColor: 'primary.main',
                            color: '#fff',
                            boxShadow: 'none',
                            fontWeight: 500,
                            height: '42px',
                            maxWidth: { xs: '160px', sm: 'none' },
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          {item.text}
                        </Button>
                      ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Popular Events Section */}
        <Box
          sx={{
            py: 8,
            width: '100vw',
            position: 'relative',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          <Container maxWidth={false}>
            <Typography
              variant="h4"
              sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 }, color: 'text.primary' }}
            >
              Popular events
            </Typography>

            {popularEvents.length > 0 ? (
              /* Existing scroll container */
              <Box
                sx={{
                  position: 'relative',
                  padding: { xs: 2, sm: 4, md: 8 },
                  overflowX: 'auto',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {/* Existing wrapper for infinite scroll */}
                <Box
                  sx={{
                    display: 'flex',
                    width: 'fit-content',
                    gap: 3,
                    animation: 'scroll 40s linear infinite',
                    '@keyframes scroll': {
                      '0%': { transform: 'translateX(0)' },
                      '100%': { transform: 'translateX(calc(-320px * 5 - 1.5rem * 5))' },
                    },
                    '&:hover': {
                      animationPlayState: 'paused',
                    },
                  }}
                >
                  {[...Array(4)].map((_, setIndex) => (
                    <Box key={`set-${setIndex}`} sx={{ display: 'flex', gap: 3 }}>
                      {popularEvents.map((event) => (
                        <Box
                          key={`${setIndex}-${event.id}`}
                          sx={{
                            width: 320,
                            flex: 'none',
                          }}
                        >
                          <EventCard event={event} />
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  mx: { xs: 2, sm: 4, md: 8 },
                  borderRadius: 4,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
                  border: '1px dashed',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'),
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  No Popular Events Yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                  Be the first to create an event that could become popular!
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
          </Container>
        </Box>

        {/* Create and Join Section */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              alignItems="center"
              direction={{ xs: 'column', md: 'row' }}
            >
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/images/placeholder.jpg"
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '400px', md: '100%' },
                    borderRadius: 2,
                    boxShadow: (theme) => (theme.palette.mode === 'dark' ? 1 : 3),
                    display: 'block',
                    mx: 'auto',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    textAlign: { xs: 'left', md: 'left' },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: { xs: 1, md: 2 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    CREATE AND MANAGE
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      color: 'text.primary',
                    }}
                  >
                    Create & organize events,
                    <br />
                    Build communities 🎯
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: { xs: 3, md: 4 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    Organize and manage your events efficiently. Connect with participants, handle
                    registrations, and create memorable experiences.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/events/create')}
                    sx={{
                      py: 1.4,
                      px: { xs: 2.5, sm: 4 },
                      borderRadius: '8px',
                      fontSize: '1rem',
                      textTransform: 'none',
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      boxShadow: 'none',
                      fontWeight: 500,
                      height: '42px',
                      maxWidth: { xs: '160px', sm: 'none' },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Create event
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Categories section - always shown */}
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 6, fontWeight: 700, color: 'text.primary' }}>
              Browse by Category
            </Typography>
            <Grid container spacing={3}>
              {[
                { icon: '🎵', name: 'Music', category: EVENT_CATEGORIES.MUSIC, color: '#FF4081' },
                { icon: '🎨', name: 'Art', category: EVENT_CATEGORIES.ART, color: '#7C4DFF' },
                {
                  icon: '🏃',
                  name: 'Sports',
                  category: EVENT_CATEGORIES.SPORTS,
                  color: '#00BCD4',
                },
                {
                  icon: '💻',
                  name: 'Tech',
                  category: EVENT_CATEGORIES.TECHNOLOGY,
                  color: '#4CAF50',
                },
                { icon: '🍽️', name: 'Food', category: EVENT_CATEGORIES.FOOD, color: '#FF9800' },
                {
                  icon: '💼',
                  name: 'Business',
                  category: EVENT_CATEGORIES.BUSINESS,
                  color: '#607D8B',
                },
              ].map((category) => (
                <Grid item xs={6} sm={4} md={2} key={category.name}>
                  <Box
                    onClick={() => router.push(`/events?category=${category.category}`)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[4],
                        borderColor: category.color,
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ mb: 1, fontSize: '2.5rem' }}>
                      {category.icon}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {category.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Your Events section - only shown when authenticated */}
        {isAuthenticated && renderYourEventsSection()}

        {/* How It Works Section */}
        <Box
          sx={{
            py: 8,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{ mb: 6, textAlign: 'center', fontWeight: 700, color: 'text.primary' }}
            >
              How It Works
            </Typography>
            <Grid container spacing={6}>
              {[
                {
                  step: '1',
                  title: 'Create Account',
                  desc: 'Sign up in seconds and join our community of event enthusiasts',
                },
                {
                  step: '2',
                  title: 'Find Events',
                  desc: 'Discover events that match your interests and schedule',
                },
                {
                  step: '3',
                  title: 'Join or Create',
                  desc: 'Participate in existing events or create your own to bring people together',
                },
              ].map((item) => (
                <Grid item xs={12} md={4} key={item.step}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        color: 'primary.main',
                        opacity: (theme) => (theme.palette.mode === 'dark' ? 0.2 : 0.15),
                        fontSize: '4.5rem',
                        fontWeight: 800,
                        mb: 2,
                      }}
                    >
                      {item.step}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">{item.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

// Add this to tell the Layout if it's a landing page
Home.isLandingPage = true;

export const getStaticProps = async () => ({
  props: {},
});

export default Home;
