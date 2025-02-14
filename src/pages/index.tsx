import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import { menuItems } from '../common/defs/menu-items';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: -8,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
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
              <Stack spacing={4}>
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
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
                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                    maxWidth: '600px',
                  }}
                >
                  All-in-one platform for event lovers. Find and create events.
                  <br />
                  Join communities. Make memories.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="contained"
                      size="large"
                      onClick={() => router.push(item.link)}
                      startIcon={item.icon}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        backgroundColor: item.id === 'discover' ? 'primary.main' : 'white',
                        color: item.id === 'discover' ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: item.id === 'discover' ? 'primary.dark' : 'grey.100',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
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
          overflow: 'hidden', // Important for animation
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 } }}>
            Popular events
          </Typography>
          
          {/* Infinite Scroll Container */}
          <Box
            sx={{
              position: 'relative',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                width: '200px',
                height: '100%',
                zIndex: 2,
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(to right, white, transparent)',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(to left, white, transparent)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                animation: 'scroll 40s linear infinite',
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(calc(-280px * 5 - 1.5rem * 5))' }, // Account for both card width and gap
                },
                '&:hover': {
                  animationPlayState: 'paused',
                },
                px: { xs: 2, sm: 4, md: 8 },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollBehavior: 'smooth',
              }}
            >
              {/* First set */}
              {[...Array(5)].map((_, index) => (
                <Card
                  key={`first-${index}`}
                  sx={{
                    minWidth: 280,
                    flex: '0 0 auto',
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
              {/* Second set (exact duplicate) */}
              {[...Array(5)].map((_, index) => (
                <Card
                  key={`second-${index}`}
                  sx={{
                    minWidth: 280,
                    flex: '0 0 auto',
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
              {/* Third set (exact duplicate) */}
              {[...Array(5)].map((_, index) => (
                <Card
                  key={`third-${index}`}
                  sx={{
                    minWidth: 280,
                    flex: '0 0 auto',
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
        </Container>
      </Box>

      {/* Create and Join Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/placeholder.jpg"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}
              >
                CREATE AND PLAY
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Create & join events,
                <br />
                Make memories 🏆
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Discover & create events with your friends or find new people with similar interests.
                Join events and activities easily. Simply, e.g. WhatsApp is just not the right platform
                to do it.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/events/create')}
                sx={{ py: 1.5, px: 4 }}
              >
                Create event
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Events Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Featured Events
          </Typography>
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.300',
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      Event Title {item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Event Categories
          </Typography>
          <Grid container spacing={3}>
            {['Music', 'Sports', 'Technology', 'Arts', 'Food', 'Business'].map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'background.neutral',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'background.paper',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s',
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography variant="h6">{category}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Extra Section for Scrolling */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {['Easy to Use', 'Secure Platform', 'Great Community', '24/7 Support'].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Paper sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {item}
                  </Typography>
                  <Typography color="text.secondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris.
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
