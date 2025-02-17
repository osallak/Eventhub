import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { menuItems } from '../defs/menu-items';

interface SocialMedia {
  label: string;
  icon: JSX.Element;
  link: string;
}

// Move components outside Footer
const DesktopSection = ({
  title,
  items,
  onItemClick,
}: {
  title: string;
  items: Array<{ text: string; link: string }>;
  onItemClick: (link: string) => void;
}) => (
  <Box>
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 600,
        mb: 3,
        color: 'text.primary',
        letterSpacing: '0.5px',
      }}
    >
      {title}
    </Typography>
    <Stack spacing={2}>
      {items.map((item, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            color: 'text.secondary',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              color: 'primary.main',
              transform: 'translateX(4px)',
            },
          }}
          onClick={() => onItemClick(item.link)}
        >
          {item.text}
        </Typography>
      ))}
    </Stack>
  </Box>
);

const MobileSection = ({
  title,
  items,
  expanded,
  onToggle,
  onItemClick,
}: {
  title: string;
  items: Array<{ text: string; link: string }>;
  expanded: boolean;
  onToggle: () => void;
  onItemClick: (link: string) => void;
}) => (
  <>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <IconButton
        sx={{
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s',
          color: 'text.secondary',
        }}
      >
        <ExpandMoreIcon />
      </IconButton>
    </Box>
    <Collapse in={expanded}>
      <Stack spacing={2} sx={{ pb: 2 }}>
        {items.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => onItemClick(item.link)}
          >
            {item.text}
          </Typography>
        ))}
      </Stack>
    </Collapse>
    <Divider />
  </>
);

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Box>
      {/* Main Footer */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: {
            xs: 0,
            md: 8,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: { xs: 4, md: 8 },
              px: { xs: 2, md: 4 },
            }}
          >
            {/* Desktop Layout */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Grid
                container
                spacing={6}
                sx={{
                  justifyContent: 'space-between',
                }}
              >
                {/* Logo and Description Section */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'text.primary',
                      }}
                      onClick={() => router.push('/')}
                    >
                      Event<span style={{ color: 'primary.main' }}>Hub</span>
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                    Your all-in-one platform for discovering, creating, and managing events. Connect
                    with people who share your interests.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {socialMedias.map((social, index) => (
                      <IconButton
                        key={index}
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s',
                        }}
                        href={social.link}
                        target="_blank"
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Grid>

                {/* Navigation Sections */}
                <Grid item xs={12} md={7}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                      <DesktopSection
                        title="Menu"
                        items={menuItems.map((item) => ({ text: item.text, link: item.link }))}
                        onItemClick={(link) => router.push(link)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DesktopSection
                        title="Information"
                        items={[
                          { text: 'About Us', link: '/about' },
                          { text: 'Terms of Service', link: '/terms' },
                          { text: 'Privacy Policy', link: '/privacy' },
                          { text: 'FAQ', link: '/faq' },
                        ]}
                        onItemClick={(link) => router.push(link)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DesktopSection
                        title="Contact"
                        items={[
                          { text: 'Support', link: '/support' },
                          { text: 'Contact Us', link: '/contact' },
                          { text: 'Feedback', link: '/feedback' },
                          {
                            text: 'Email: support@eventhub.com',
                            link: 'mailto:support@eventhub.com',
                          },
                          { text: 'Phone: +1 234 567 890', link: 'tel:+1234567890' },
                        ]}
                        onItemClick={(link) => router.push(link)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            {/* Mobile Layout - Show only on xs and sm */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: 'text.primary',
                  }}
                >
                  Event<span style={{ color: 'primary.main' }}>Hub</span>
                </Typography>
              </Box>
              <MobileSection
                title="Menu"
                items={menuItems.map((item) => ({ text: item.text, link: item.link }))}
                expanded={expandedSection === 'Menu'}
                onToggle={() => handleToggle('Menu')}
                onItemClick={(link) => router.push(link)}
              />
              <MobileSection
                title="Information"
                items={[
                  { text: 'About Us', link: '/about' },
                  { text: 'Terms of Service', link: '/terms' },
                  { text: 'Privacy Policy', link: '/privacy' },
                  { text: 'FAQ', link: '/faq' },
                ]}
                expanded={expandedSection === 'Information'}
                onToggle={() => handleToggle('Information')}
                onItemClick={(link) => router.push(link)}
              />
              <MobileSection
                title="Contact"
                items={[
                  { text: 'Support', link: '/support' },
                  { text: 'Contact Us', link: '/contact' },
                  { text: 'Feedback', link: '/feedback' },
                  {
                    text: 'Email: support@eventhub.com',
                    link: 'mailto:support@eventhub.com',
                  },
                  { text: 'Phone: +1 234 567 890', link: 'tel:+1234567890' },
                ]}
                expanded={expandedSection === 'Contact'}
                onToggle={() => handleToggle('Contact')}
                onItemClick={(link) => router.push(link)}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Bar */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper'),
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2024 EventHub. All rights reserved.
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              sx={{
                '& a': {
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
