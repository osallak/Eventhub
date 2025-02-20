import { Routes } from '@common/constants/routes';
import { useTheme as useCustomTheme } from '@common/contexts/ThemeContext';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { AccountCircle } from '@mui/icons-material';
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

interface TopbarProps {
  isLandingPage?: boolean;
  scrollProgress?: number;
}

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
  const router = useRouter();
  const customTheme = useCustomTheme();
  const { mode, toggleMode } = customTheme;
  const { logout, isAuthenticated } = useAuth();

  const [menuState, setMenuState] = useState({
    mobileMenu: false,
    profile: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  const handleMenuClose = () => {
    setMenuState((prev) => ({
      ...prev,
      mobileMenu: false,
      profile: null,
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

  const handleNavigation = (href: string) => {
    router.push(href);
    handleMenuClose();
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

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

  console.log('Auth state:', { isAuthenticated });

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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flex: 1 }}>
            <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
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
                  alignItems: 'baseline',
                }}
                onClick={() => router.push('/')}
              >
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
              </Typography>

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
              <IconButton
                onClick={handleMenuOpen('notifications')}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>

              <IconButton onClick={toggleMode} size="small" sx={commonIconButtonStyles.sx}>
                {mode === 'light' ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </IconButton>

              <IconButton
                onClick={handleMenuOpen('profile')}
                size="small"
                sx={commonIconButtonStyles.sx}
              >
                <AccountCircle fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                cursor: 'pointer',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'baseline',
              }}
              onClick={() => router.push('/')}
            >
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu {isAuthenticated ? '(Logged In)' : '(Not Logged In)'}
            </Typography>
            <IconButton onClick={handleMenuClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
              p: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
            }}
          >
            <IconButton onClick={toggleMode} size="small" sx={commonIconButtonStyles.sx}>
              {mode === 'light' ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>

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

            <Divider sx={{ my: 1 }} />

            {isAuthenticated ? (
              <Stack spacing={1}>
                <Button
                  fullWidth
                  onClick={() => handleNavigation('/profile')}
                  startIcon={<AccountCircle />}
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
                    logout();
                    router.push('/');
                    handleMenuClose();
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
            ) : (
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    router.push(Routes.Auth.Login);
                    handleMenuClose();
                  }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push(Routes.Auth.Register);
                    handleMenuClose();
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Drawer>

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
            No new notifications
          </Typography>
        </MenuItem>
      </Menu>

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
        {isAuthenticated ? (
          <>
            <MenuItem
              onClick={() => {
                handleNavigation('/profile');
                handleMenuClose();
              }}
              sx={{ py: 1.5 }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Profile
                </Typography>
              </Stack>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => {
                logout();
                router.push('/');
                handleMenuClose();
              }}
              sx={{ py: 1.5, color: 'error.main' }}
            >
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                router.push(Routes.Auth.Login);
                handleMenuClose();
              }}
              sx={{ py: 1.5 }}
            >
              <Typography variant="body2">Login</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push(Routes.Auth.Register);
                handleMenuClose();
              }}
              sx={{ py: 1.5 }}
            >
              <Typography variant="body2">Sign Up</Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};
