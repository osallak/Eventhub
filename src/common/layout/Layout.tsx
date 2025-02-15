import { useTheme as useAppTheme } from '@common/contexts/ThemeContext';
import { Topbar } from '@common/layout/Topbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { menuItems, profileMenuItems } from '../defs/menu-items';
import Footer from './Footer';

interface ILayoutProps {
  children: React.ReactNode;
  isLandingPage?: boolean;
}

const Layout = (props: ILayoutProps) => {
  const { children, isLandingPage = false } = props;
  const theme = useTheme();
  const [openLeftbar, setOpenLeftbar] = useState(true);
  const [display, setDisplay] = useState(true);
  const underMaintenance = process.env.NEXT_PUBLIC_UNDER_MAINTENANCE === 'true';
  const { t } = useTranslation('common');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleMode } = useAppTheme();

  // Handle scroll transparency
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  useEffect(() => {
    if (!isLandingPage) {
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  useEffect(() => {
    setDisplay(!underMaintenance);
  }, [underMaintenance]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (url: string) => {
    router.push(url);
    handleClose();
  };

  if (!display) {
    return (
      <Box
        id="webview-container"
        sx={{
          height: '100%',
          backgroundColor: 'common.white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ padding: 1 }}>
          <Typography textAlign="center" marginBottom={2}>
            {t('maintenance_message')}
          </Typography>
          <Typography textAlign="center" marginBottom={2}>
            {t('maintenance_thanks')}
          </Typography>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 55,
              fontWeight: 500,
              borderRadius: '4px',
              fontFamily: 'Raleway',
              backgroundColor: '#ff7b00',
              color: 'white',
              fontSize: 16,
              gap: '8px',
              marginTop: '24px',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
            onClick={() => {
              window.history.back();
            }}
          >
            <ArrowBackIcon />
            {t('return')}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'background.default'),
        minHeight: '100vh',
      }}
    >
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'transparent',
        }}
      >
        <Topbar
          isLandingPage={isLandingPage}
          scrollProgress={scrollProgress}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="top"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Menu
              </Typography>
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Add theme toggle for mobile */}
            <Button
              fullWidth
              startIcon={mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              onClick={toggleMode}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>

            {/* Menu Items in Grid */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              {menuItems.map((item) => (
                <Grid item xs={6} key={item.id}>
                  <Button
                    fullWidth
                    startIcon={item.icon}
                    onClick={() => {
                      router.push(item.link);
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      py: 1,
                      px: 2,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Profile Items */}
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={1}>
              {profileMenuItems.map((item) => (
                <Grid item xs={6} key={item.id}>
                  <Button
                    fullWidth
                    startIcon={item.icon}
                    onClick={() => {
                      handleMenuItemClick(item.url);
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      py: 1,
                      px: 2,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Drawer>

        {children}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
