import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Routes } from '@common/constants/routes';
import { CircularProgress, Box } from '@mui/material';

export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  ANY = 'ANY'
}

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

export const withAuth = (WrappedComponent: NextPage, mode: AUTH_MODE = AUTH_MODE.LOGGED_IN) => {
  const WithAuthWrapper: NextPage = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
        router.replace('/auth/login');
      } else if (mode === AUTH_MODE.LOGGED_OUT && isAuthenticated) {
        router.replace('/');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return null;

    return <WrappedComponent {...props} />;
  };

  return WithAuthWrapper;
};

export default withAuth;
