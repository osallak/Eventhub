import { useTheme } from '@common/contexts/ThemeContext';
import Routes from '@common/defs/routes';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { AccountCircle, Language as LanguageIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  isLandingPage?: boolean;
  scrollProgress?: number;
  onMobileMenuOpen?: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export const Topbar = ({
  isLandingPage = false,
  scrollProgress = 1,
  onMobileMenuOpen,
}: TopbarProps) => {
  console.log('Topbar rendering');
  const { t } = useTranslation(['topbar']);
  const router = useRouter();
  const { asPath } = router;
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);

  const onAuthButtonClick = (mode: string) => {
    if (router.pathname === Routes.Common.Home) {
      if (mode === 'login') {
        return router.push(Routes.Auth.Login);
      }
      if (mode === 'register') {
        return router.push(Routes.Auth.Register);
      }
    }
    // if login coming from any other page then add url query param to redirect back to the same page after login
    if (mode === 'login') {
      router.push({
        pathname: Routes.Auth.Login,
        query: { url: encodeURIComponent(router.pathname) },
      });
    }
    if (mode === 'register') {
      router.push({
        pathname: Routes.Auth.Register,
        query: { url: encodeURIComponent(router.pathname) },
      });
    }
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenu(null);
  };

  // Add this helper function
  const getBackgroundColor = (theme: any) => {
    if (isLandingPage) {
      const color = theme.palette.mode === 'dark' ? '33, 33, 33' : '255, 255, 255';
      return `rgba(${color}, ${scrollProgress})`;
    }
    return theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper;
  };

  // Use onMobileMenuOpen if provided, otherwise use local state
  const handleMobileMenuOpen = () => {
    if (onMobileMenuOpen) {
      onMobileMenuOpen();
    } else {
      setMobileMenuOpen(true);
    }
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
      }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
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
            Event<span style={{ color: '#2196F3' }}>Manager</span>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => router.push('/events')}
              sx={{
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              Discover Events
            </Button>
            <Button
              color="inherit"
              onClick={() => router.push('/events/create')}
              sx={{
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              Create Event
            </Button>

            {/* Language Menu */}
            <IconButton
              onClick={handleLanguageClick}
              sx={{
                color: 'inherit',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={languageMenu}
              open={Boolean(languageMenu)}
              onClose={handleLanguageClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 150,
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
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Theme Toggle */}
            <IconButton onClick={toggleMode} sx={{ color: 'inherit' }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileClick}
              sx={{
                ml: 1,
                border: '1px solid',
                borderColor: 'divider',
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
                  minWidth: 200,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  router.push('/events/history');
                  handleClose();
                }}
              >
                History
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push('/events/upcoming');
                  handleClose();
                }}
              >
                Upcoming Events
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push('/settings');
                  handleClose();
                }}
              >
                Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton sx={{ display: { md: 'none' } }} onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>
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

            {/* Language Options */}
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                px: 2,
                pt: 2,
                pb: 1,
                fontWeight: 500,
              }}
            >
              Language
            </Typography>
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                fullWidth
                onClick={() => {
                  // Language change logic will go here
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
                {lang.label}
              </Button>
            ))}

            {/* Theme Toggle */}
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
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>

            <Divider sx={{ my: 1 }} />

            {/* Profile Items */}
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

            <Button
              fullWidth
              onClick={() => {
                router.push('/settings');
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
              Settings
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
    </AppBar>
  );
};
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius + 'px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '.MuiTouchRipple-child': {
    backgroundColor: theme.palette.primary.main,
  },
}));
