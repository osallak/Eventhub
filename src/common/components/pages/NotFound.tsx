import NotFoundIllustration from '@common/assets/svgs/NotFoundIllustration';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Routes from '@common/defs/routes';
import { Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container className="flex flex-col items-center justify-center pt-12" maxWidth="xs">
      <Typography variant="h3" paragraph className="mb-6" textAlign="center">
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        paragraph
        className="mb-6 text-center"
        textAlign="center"
        sx={{ color: 'text.secondary' }}
      >
        Sorry, we couldn't find the page you're looking for.
        <br />
        Perhaps you've mistyped the URL? Be sure to check your spelling.
      </Typography>
      <NotFoundIllustration
        sx={{
          width: '100%',
          marginTop: '2rem',
          marginBottom: '4rem',
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Button component={NextLink} href={Routes.Common.Home} size="large" variant="contained">
          Return Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
