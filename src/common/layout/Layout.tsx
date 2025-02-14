import { AccountCircle } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import {
  alpha,
  AppBar,
  Button,
  Container,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
  useTheme,
  Grid,
  Divider,
} from '@mui/material';
import Box from '@mui/material/Box';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { menuItems, profileMenuItems } from '../defs/menu-items';
import Footer from './Footer';
import CloseIcon from '@mui/icons-material/Close';

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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: isLandingPage
              ? `rgba(255, 255, 255, ${scrollProgress})`
              : 'rgba(255, 255, 255, 1)',
            transition: 'all 0.5s ease',
            backdropFilter: isLandingPage && scrollProgress > 0 ? 'blur(20px)' : 'none',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            color: isLandingPage && scrollProgress < 0.9 ? 'white' : 'text.primary',
            boxShadow: 'none',
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              px: 0,
            }}
          >
            <Toolbar
              sx={{
                minHeight: { xs: 56, md: 64 },
                px: { xs: 2, sm: 4, md: 8 },
                py: 1,
                justifyContent: 'space-between',
              }}
            >
              {/* Logo */}
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  letterSpacing: '-0.5px',
                  marginLeft: { xs: 0, md: '-21px' },
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
                onClick={() => router.push('/')}
              >
                Event
                <span
                  style={{
                    color: scrollProgress > 0.9 ? '#2196F3' : '#fff',
                    opacity: scrollProgress > 0.9 ? 1 : 0.95,
                  }}
                >
                  Manager
                </span>
              </Typography>

              {/* Desktop Navigation - Hide on mobile */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    color="inherit"
                    onClick={() => router.push(item.link)}
                    startIcon={item.icon}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor:
                          scrollProgress > 0.9 ? alpha('#000', 0.04) : alpha('#fff', 0.15),
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}

                {/* Profile Menu */}
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    ml: 1,
                    border: '1px solid',
                    borderColor: scrollProgress > 0.9 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor:
                        scrollProgress > 0.9 ? alpha('#000', 0.04) : alpha('#fff', 0.15),
                    },
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 2,
                      overflow: 'visible',
                      border: '1px solid',
                      borderColor: 'rgba(0,0,0,0.08)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {profileMenuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.url)}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          color: 'text.primary',
                          '& .MuiSvgIcon-root': {
                            fontSize: 20,
                            color: 'text.secondary',
                          },
                        }}
                      >
                        {item.icon}
                        <Typography variant="body2">{item.title}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Mobile Menu Button - Show only on mobile */}
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setMobileMenuOpen(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>

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
    </div>
  );
};

export default Layout;
