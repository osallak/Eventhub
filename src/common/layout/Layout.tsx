import { AccountCircle } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  alpha,
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
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

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  const [openLeftbar, setOpenLeftbar] = useState(true);
  const [display, setDisplay] = useState(true);
  const underMaintenance = process.env.NEXT_PUBLIC_UNDER_MAINTENANCE === 'true';
  const { t } = useTranslation('common');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle scroll transparency
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

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
          elevation={trigger ? 4 : 0}
          sx={{
            background: trigger ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: trigger ? 'blur(20px)' : 'none',
            borderBottom: trigger ? '1px solid rgba(0,0,0,0.05)' : 'none',
            color: trigger ? 'text.primary' : 'white',
            boxShadow: trigger ? '0px 1px 8px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              sx={{
                minHeight: { xs: 64, md: 80 },
                px: { xs: 2, md: 3 },
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
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
                onClick={() => router.push('/')}
              >
                Event
                <span
                  style={{
                    color: trigger ? '#2196F3' : '#fff',
                    opacity: trigger ? 1 : 0.95,
                  }}
                >
                  Manager
                </span>
              </Typography>

              {/* Navigation Items */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        backgroundColor: trigger ? alpha('#000', 0.04) : alpha('#fff', 0.15),
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
                    borderColor: trigger ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: trigger ? alpha('#000', 0.04) : alpha('#fff', 0.15),
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
            </Toolbar>
          </Container>
        </AppBar>

        {/* Add toolbar spacing */}
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </div>
  );
};

export default Layout;
