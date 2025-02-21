import { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AUTH_MODE, WithAuthOptions } from '../types/auth.types';
import { Routes } from '@common/constants/routes';
import useAuth from '../hooks/api/useAuth';
import { CircularProgress, Box } from '@mui/material';

const withAuth = ({
  mode = AUTH_MODE.LOGGED_IN,
  redirectUrl = Routes.Auth.Login,
}: WithAuthOptions) => {
  return (Component: ComponentType) => {
    const WithAuthComponent: FC = (props) => {
      const { isAuthenticated, isLoading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!isLoading && mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
          const currentPath = router.asPath;

          const loginUrl = `${redirectUrl}?returnUrl=${encodeURIComponent(currentPath)}`;

          router.replace(loginUrl);
        }
      }, [isAuthenticated, isLoading, router]);

      // Show loading spinner while checking auth
      if (isLoading) {
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 200px)', // Account for header/footer
            }}
          >
            <CircularProgress />
          </Box>
        );
      }

      // Don't render anything if not authenticated for protected routes
      if (mode === AUTH_MODE.LOGGED_IN && !isAuthenticated) {
        return null;
      }

      // Don't render anything if authenticated for auth-only routes
      if (mode === AUTH_MODE.LOGGED_OUT && isAuthenticated) {
        return null;
      }

      // Render the protected component
      return <Component {...props} />;
    };

    return WithAuthComponent;
  };
};

export default withAuth;
