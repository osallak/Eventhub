import { Routes } from '@common/constants/routes';
import { useTheme as useCustomTheme } from '@common/contexts/ThemeContext';
import { useAuth as useAuthContext } from '@modules/auth/contexts/AuthContext';
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
import { Theme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  isLandingPage?: boolean;
  scrollProgress?: number;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

type NavItem = {
  label: string;
  href: string;
  requiresAuth: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/', requiresAuth: false },
  { label: 'Events', href: '/events', requiresAuth: false },
  { label: 'Create Event', href: '/events/create', requiresAuth: true },
  { label: 'Profile', href: '/profile', requiresAuth: true },
];

export const Topbar = ({ isLandingPage = false, scrollProgress = 1 }: TopbarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const customTheme = useCustomTheme();
  // const theme = useMuiTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleMode } = customTheme;
  const { logout } = useAuth();
  const { isAuthenticated } = useAuthContext();

  // Consolidate menu state
  const [menuState, setMenuState] = useState({
    mobileMenu: false,
    profile: null as HTMLElement | null,
    language: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  const handleMenuClose = () => {
    setMenuState((prev) => ({
      ...prev,
      mobileMenu: false,
      profile: null,
      language: null,
      notifications: null,
    }));
  };

  const handleMenuOpen =
    (type: keyof typeof menuState) => (event: React.MouseEvent<HTMLElement>) => {
      setMenuState((prev) => ({
        ...prev,
        [type]: event.currentTarget,
      }));
    };

  // Remove unused variables and functions
  const handleNavigation = (href: string) => {
    router.push(href);
    handleMenuClose();
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  const renderAuthButtons = () => (
    <Stack direction="row" spacing={2}>
      {isAuthenticated ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            logout();
            router.push('/');
          }}
        >
          Logout
        </Button>
      ) : (
        <>
          <Button variant="outlined" color="primary" onClick={() => router.push(Routes.Auth.Login)}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(Routes.Auth.Register)}
          >
            Sign Up
          </Button>
        </>
      )}
    </Stack>
  );

  // Add this helper function
  const getBackgroundColor = (theme: Theme) => {
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
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.href}
                    color="inherit"
                    onClick={() => handleNavigation(item.href)}
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
                    {item.label}
                  </Button>
                ))}
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
                onClick={handleMenuOpen('notifications')}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>

              {/* 2. Language */}
              <IconButton
                onClick={handleMenuOpen('language')}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
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
              <IconButton
                onClick={handleMenuOpen('profile')}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
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
            <IconButton
              sx={{ ml: 'auto' }}
              onClick={() => setMenuState((prev) => ({ ...prev, mobileMenu: true }))}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="top"
        open={menuState.mobileMenu}
        onClose={handleMenuClose}
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
            <IconButton onClick={handleMenuClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Menu Items */}
          <Stack spacing={1}>
            {filteredNavItems.map((item) => (
              <Button
                key={item.href}
                fullWidth
                onClick={() => handleNavigation(item.href)}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Box sx={{ px: 2, py: 1 }}>{renderAuthButtons()}</Box>
          </Stack>
        </Box>
      </Drawer>

      {/* Language Menu */}
      <Menu
        anchorEl={menuState.language}
        open={Boolean(menuState.language)}
        onClose={handleMenuClose}
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
              handleMenuClose();
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
        anchorEl={menuState.profile}
        open={Boolean(menuState.profile)}
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
        <MenuItem
          onClick={() => {
            router.push('/profile');
            handleMenuClose();
          }}
          sx={{ py: 1.5 }}
        >
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
        anchorEl={menuState.notifications}
        open={Boolean(menuState.notifications)}
        onClose={handleMenuClose}
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
