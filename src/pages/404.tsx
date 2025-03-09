import { NextPage } from 'next';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  const theme = useTheme();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontSize: '6rem',
            fontWeight: 700,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: '500px'
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
