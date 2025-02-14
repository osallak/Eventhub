import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { menuItems } from '../common/defs/menu-items';

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Event Manager
            </Typography>
            <Typography variant="h5" component="h2" color="text.secondary" paragraph>
              Discover and create amazing events
            </Typography>
            <Box sx={{ mt: 4 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="contained"
                  size="large"
                  onClick={() => router.push(item.url)}
                  startIcon={item.icon}
                  sx={{ mx: 1 }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          </Grid>
          
          {/* Placeholder for featured events section */}
          <Grid item xs={12} sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
              Popular Events
            </Typography>
            <Grid container spacing={4}>
              {/* We'll add event cards here later */}
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 200, bgcolor: 'grey.200', borderRadius: 1 }}>
                  {/* Placeholder for event card */}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 200, bgcolor: 'grey.200', borderRadius: 1 }}>
                  {/* Placeholder for event card */}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 200, bgcolor: 'grey.200', borderRadius: 1 }}>
                  {/* Placeholder for event card */}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
