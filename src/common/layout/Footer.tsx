import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { menuItems } from '../defs/menu-items';

interface SocialMedia {
  label: string;
  icon: JSX.Element;
  link: string;
}

const Footer = () => {
  const socialMedias: SocialMedia[] = [
    {
      label: 'Facebook',
      icon: <FacebookRoundedIcon sx={{ fontSize: '2rem' }} />,
      link: '#',
    },
    {
      label: 'Instagram',
      icon: <InstagramIcon sx={{ fontSize: '2rem' }} />,
      link: '#',
    },
    {
      label: 'Twitter',
      icon: <TwitterIcon sx={{ fontSize: '2rem' }} />,
      link: '#',
    },
    {
      label: 'YouTube',
      icon: <YouTubeIcon sx={{ fontSize: '2rem' }} />,
      link: '#',
    },
  ];
  const router = useRouter();
  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Left section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Event<span style={{ color: '#2196F3' }}>Manager</span>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Get out there & discover your next event
            </Typography>
            <Typography
              component="a"
              href="mailto:support@eventmanager.com"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              support@eventmanager.com
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              {socialMedias.map((socialMedia, socialMediaIndex) => (
                <Link
                  key={socialMediaIndex}
                  href={socialMedia.link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: 'text.secondary',
                    borderRadius: 2,
                    padding: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all, 0.15s',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {socialMedia.icon}
                </Link>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              © {new Date().getFullYear()} EventManager. All rights reserved
            </Typography>
          </Grid>

          {/* Menu section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Menu
            </Typography>
            <Stack spacing={2}>
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => router.push(item.link)}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    padding: 0,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Stack>
          </Grid>

          {/* Information section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Information
            </Typography>
            <Stack spacing={2}>
              {['Terms and conditions', 'Privacy policy', 'Feedback form'].map((text) => (
                <Button
                  key={text}
                  onClick={() => router.push('#')}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    padding: 0,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {text}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
