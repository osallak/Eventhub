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
} from '@mui/material';
import { useRouter } from 'next/router';
import { menuItems } from '../common/defs/menu-items';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Box>
      {/* Hero Section with background */}
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: -8, // Compensate for toolbar spacing
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h1"
                color="white"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2,
                }}
              >
                Discover Amazing Events
              </Typography>
              <Typography variant="h5" color="white" sx={{ mb: 4, opacity: 0.9 }}>
                Join and create unforgettable experiences
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="contained"
                    size="large"
                    onClick={() => router.push(item.link)}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
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
