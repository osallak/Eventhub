import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AUTH_MODE, WithAuthOptions } from '../types/auth.types';
import { useAuth } from '../contexts/AuthContext';
import { Routes } from '@common/constants/routes';
import { CircularProgress, Box } from '@mui/material';

// Loading component
const LoadingScreen = () => (
  <Box 
    sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}
  >
    <CircularProgress />
  </Box>
);

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions
) => {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { mode, redirectUrl } = options;

    useEffect(() => {
      if (!isLoading && mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
        // Store the current URL to redirect back after login
        const returnUrl = encodeURIComponent(router.asPath);
        router.push(`${Routes.Auth.Login}?returnUrl=${returnUrl}`);
      }
    }, [isLoading, isAuthenticated, mode, redirectUrl, router]);

    // Show loading screen while checking auth status
    if (isLoading) {
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
};
