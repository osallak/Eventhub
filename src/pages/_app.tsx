import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';
import ProgressBar from '@common/components/lib/feedbacks/ProgressBar';
import { DataProvider } from '@common/contexts/DataContext';
import { DialogProvider } from '@common/contexts/DialogContext';
import { RoutingHistoryProvider } from '@common/contexts/RoutingHistoryContext';
import SnackbarProvider from '@common/contexts/SnackbarProvider';
import { ThemeProvider } from '@common/contexts/ThemeContext';
import Layout from '@common/layout/Layout';
import GlobalStyles from '@common/theme/GlobalStyles';
import { AuthProvider } from '@modules/auth/contexts';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Routes } from '@common/constants/routes';

// declare module '@mui/material/Button' { // If we add a color, then we need to add the color in each component
//    interface ButtonPropsColorOverrides {
//    }
// }

// Change from ComponentType to FC
export interface PageComponent extends React.FC<Record<string, unknown>> {
  isLandingPage?: boolean;
}

const preloadAuthPages = () => {
  const authPages = [Routes.Auth.Login, Routes.Auth.Register];
  authPages.forEach((page) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = page;
    document.head.appendChild(link);
  });
};

const App = ({ Component, pageProps }: AppProps) => {
  const { initialized: authInitialized } = useAuth();
  useEffect(() => {
    preloadAuthPages();
  }, []);

  if (!authInitialized) {
    return <LoadingScreen />;
  }
  return (
    <Layout isLandingPage={(Component as PageComponent).isLandingPage}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'background.default'),
          m: 0,
          p: 0,
        }}
      >
        <Component {...pageProps} />
      </Box>
    </Layout>
  );
};

const AppWrapper = (props: AppProps) => {
  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <SnackbarProvider>
            <AuthProvider>
              <GlobalStyles />
              <DataProvider>
                <RoutingHistoryProvider>
                  <DialogProvider>
                    <ProgressBar />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <App {...props} />
                    </LocalizationProvider>
                  </DialogProvider>
                </RoutingHistoryProvider>
              </DataProvider>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default AppWrapper;
