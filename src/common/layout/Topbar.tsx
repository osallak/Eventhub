import { useTheme } from '@common/contexts/ThemeContext';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { AccountCircle, Language as LanguageIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@mui/material/styles';

interface TopbarProps {
  isLandingPage?: boolean;
  scrollProgress?: number;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export const Topbar = ({ isLandingPage = false, scrollProgress = 1 }: TopbarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mode, toggleMode } = useTheme();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleMenuClose();
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenu(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Add this helper function
  const getBackgroundColor = (theme: any) => {
    if (isLandingPage) {
      const color = theme.palette.mode === 'dark' ? '33, 33, 33' : '255, 255, 255';
      return `rgba(${color}, ${scrollProgress})`;
    }
    return theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper;
  };

  const commonIconButtonStyles = {
    sx: {
      color: 'inherit',
      p: 1,
      borderRadius: '6px',
      '&:hover': {
        backgroundColor: (theme: Theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
      },
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: (theme) => getBackgroundColor(theme),
        transition: 'all 0.5s ease',
        backdropFilter: isLandingPage && scrollProgress > 0 ? 'blur(20px)' : 'none',
        borderBottom: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        color: (theme) =>
          isLandingPage && scrollProgress < 0.9 ? '#fff' : theme.palette.text.primary,
        boxShadow: 'none',
        px: 0,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: 0,
          maxWidth: '100%',
          mx: 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            minHeight: '72px',
            p: '0 !important',
            mx: { xs: 2, sm: 4, md: 5 },
          }}
        >
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flex: 1 }}>
            {/* Left section: Logo + Navigation */}
            <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
              {/* Logo */}
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  letterSpacing: '-0.5px',
                  minWidth: 'fit-content',
                  mr: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
                onClick={() => router.push('/')}
              >
                {/* Logo Icon */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                    }}
                  >
                    eh
                  </Typography>
                </Box>

                {/* Brand Name */}
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Event
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'text.primary',
                    }}
                  >
                    Hub
                  </Typography>
                </Box>
              </Typography>

              {/* Main Navigation */}
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  onClick={() => router.push('/events')}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {t('Discover Events')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => router.push('/events/create')}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {t('Create Event')}
                </Button>
              </Stack>
            </Stack>

            {/* Right section: Actions */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                ml: 'auto',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '8px',
                p: 0.5,
              }}
            >
              {/* 1. Notifications */}
              <IconButton
                onClick={handleNotificationClick}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>

              {/* 2. Language */}
              <IconButton onClick={handleLanguageClick} size="small" sx={commonIconButtonStyles.sx}>
                <LanguageIcon fontSize="small" />
              </IconButton>

              {/* 3. Theme */}
              <IconButton onClick={toggleMode} size="small" sx={commonIconButtonStyles.sx}>
                {mode === 'light' ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </IconButton>

              {/* 4. Profile */}
              <IconButton onClick={handleMenuOpen} size="small" sx={commonIconButtonStyles.sx}>
                <AccountCircle fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Mobile: Only Logo + Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                cursor: 'pointer',
                letterSpacing: '-0.5px',
              }}
              onClick={() => router.push('/')}
            >
              Event<span style={{ color: '#2196F3' }}>Hub</span>
            </Typography>
            <IconButton sx={{ ml: 'auto' }} onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

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
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Menu Items */}
          <Stack spacing={1}>
            <Button
              fullWidth
              onClick={() => {
                router.push('/profile');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Profile
            </Button>

            <Button
              fullWidth
              onClick={() => {
                router.push('/events');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Discover Events
            </Button>

            <Button
              fullWidth
              onClick={() => {
                router.push('/events/create');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Create Event
            </Button>

            <Button
              fullWidth
              onClick={() => {
                router.push('/events/history');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              History
            </Button>

            <Button
              fullWidth
              onClick={() => {
                router.push('/events/upcoming');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Upcoming Events
            </Button>

            <Divider sx={{ my: 1 }} />

            <Button
              fullWidth
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'error.main',
                py: 1,
                px: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Language Menu */}
      <Menu
        anchorEl={languageMenu}
        open={Boolean(languageMenu)}
        onClose={handleLanguageClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => {
              // Language change logic will go here
              handleLanguageClose();
            }}
            sx={{
              py: 1,
              px: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2">{lang.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      >
        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('Profile')}
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push('/events/history');
            handleMenuClose();
          }}
          sx={{ py: 1.5 }}
        >
          <Typography variant="body2">{t('History')}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push('/events/upcoming');
            handleMenuClose();
          }}
          sx={{ py: 1.5 }}
        >
          <Typography variant="body2">{t('Upcoming Events')}</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            logout();
            handleMenuClose();
          }}
          sx={{ py: 1.5, color: 'error.main' }}
        >
          <Typography variant="body2">{t('Logout')}</Typography>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 320,
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      >
        <MenuItem sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('No new notifications')}
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
