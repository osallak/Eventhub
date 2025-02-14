import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { menuItems } from '../common/defs/menu-items';
import type { PageComponent } from './_app'; // Add this import

const Home: PageComponent = () => {
  const router = useRouter();
  const isAuthenticated = false; // We'll replace this with real auth later

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
                bgcolor: 'grey.50',
                border: '1px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
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

    if (!hasEvents) {
      return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                borderRadius: 4,
                bgcolor: 'grey.50',
                border: '1px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                No Events Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                Start your journey by creating your first event or join existing ones.
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
                  onClick={() => router.push('/events/create')}
                  sx={{ px: 4 }}
                >
                  Create Event
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/events')}
                  sx={{ px: 4 }}
                >
                  Discover Events
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      );
    }

    // Return the events list for logged-in users with events
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth={false}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 } }}>
            Your events
          </Typography>
          {/* ... rest of the infinite scroll events section ... */}
        </Container>
      </Box>
    );
  };

  return (
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
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/images/hero-bg.jpg")',
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
                    color: 'white',
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
                    color: 'white',
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
                          backgroundColor: '#0095F6',
                          color: 'white',
                          boxShadow: 'none',
                          fontWeight: 500,
                          height: '42px',
                          maxWidth: { xs: '160px', sm: 'none' },
                          '&:hover': {
                            backgroundColor: '#1976D2',
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
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 } }}>
            Popular events
          </Typography>

          {/* Scroll Container */}
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
            {/* Wrapper for infinite scroll */}
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                gap: 3,
                animation: 'scroll 40s linear infinite',
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(calc(-280px * 5 - 1.5rem * 5))' }, // Exact width of one set
                },
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {/* First set */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, index) => (
                  <Card
                    key={`first-${index}`}
                    sx={{
                      width: 280,
                      flex: 'none',
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
                        height: 140,
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
                        Event Title {(index % 5) + 1}
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {12 + index} Spots left
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: Feb {20 + (index % 10)}, 2024 • 18:00-20:00
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Venue: Event Center {(index % 3) + 1}, City
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Second set */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, index) => (
                  <Card
                    key={`second-${index}`}
                    sx={{
                      width: 280,
                      flex: 'none',
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
                        height: 140,
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
                        Event Title {(index % 5) + 1}
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {12 + index} Spots left
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: Feb {20 + (index % 10)}, 2024 • 18:00-20:00
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Venue: Event Center {(index % 3) + 1}, City
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Third set for seamless scrolling */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, index) => (
                  <Card
                    key={`third-${index}`}
                    sx={{
                      width: 280,
                      flex: 'none',
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
                        height: 140,
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
                        Event Title {(index % 5) + 1}
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {12 + index} Spots left
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: Feb {20 + (index % 10)}, 2024 • 18:00-20:00
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Venue: Event Center {(index % 3) + 1}, City
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Fourth set for seamless scrolling */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, index) => (
                  <Card
                    key={`fourth-${index}`}
                    sx={{
                      width: 280,
                      flex: 'none',
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
                        height: 140,
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
                        Event Title {(index % 5) + 1}
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {12 + index} Spots left
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {index % 2 === 0 ? 'Beginner' : 'Advanced'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: Feb {20 + (index % 10)}, 2024 • 18:00-20:00
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Venue: Event Center {(index % 3) + 1}, City
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Create and Join Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
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
                  boxShadow: 3,
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
                    backgroundColor: '#0095F6',
                    color: 'white',
                    boxShadow: 'none',
                    fontWeight: 500,
                    height: '42px',
                    maxWidth: { xs: '160px', sm: 'none' },
                    '&:hover': {
                      backgroundColor: '#1976D2',
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

      {renderYourEventsSection()}

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 6, textAlign: 'center', fontWeight: 700 }}>
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
                      opacity: 0.15,
                      fontSize: '4.5rem',
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
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
  );
};

// Add this to tell the Layout if it's a landing page
Home.isLandingPage = true;

export default Home;
