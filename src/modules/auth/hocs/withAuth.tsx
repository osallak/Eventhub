import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AUTH_MODE, WithAuthOptions } from '../types/auth.types';
import useAuth from '../hooks/useAuth';
import { Routes } from '@common/constants/routes';
import { CircularProgress, Box } from '@mui/material';

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const { isAuthenticated, initialized } = useAuth();
    const { mode, redirectUrl } = options;

    useEffect(() => {
      if (!initialized) {
        return;
      }

      if (mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
        // Store the current URL to redirect back after login
        const returnUrl = encodeURIComponent(router.asPath);
        router.push(`${Routes.Auth.Login}?returnUrl=${returnUrl}`);
      } else if (mode === AUTH_MODE.LOGGED_OUT && isAuthenticated) {
        router.replace(options.redirectUrl);
      }
    }, [router, isAuthenticated, initialized]);

    // Show loading screen while checking auth status
    if (!initialized) {
      return <LoadingScreen />;
    }

    // Allow rendering for public routes
    if (mode === AUTH_MODE.PUBLIC) {
      return <Component {...props} />;
    }

    // Don't render protected content for non-authenticated users
    if (mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
      return <LoadingScreen />;
    }

    return <Component {...props} />;
  };

  return WithAuthComponent;
};
