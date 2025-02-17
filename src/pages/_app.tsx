import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';
import ProgressBar from '@common/components/lib/feedbacks/ProgressBar';
import { DataProvider } from '@common/contexts/DataContext';
import { DialogProvider } from '@common/contexts/DialogContext';
import { RoutingHistoryProvider } from '@common/contexts/RoutingHistoryContext';
import SnackbarProvider from '@common/contexts/SnackbarProvider';
import { ThemeProvider } from '@common/contexts/ThemeContext';
import Layout from '@common/layout/Layout';
import GlobalStyles from '@common/theme/GlobalStyles';
import useAuth from '@modules/auth/hooks/api/useAuth';
import type {} from '@mui/lab/themeAugmentation';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

// declare module '@mui/material/Button' { // If we add a color, then we need to add the color in each component
//    interface ButtonPropsColorOverrides {
//    }
// }

// Change from ComponentType to FC
export interface PageComponent extends React.FC<Record<string, unknown>> {
  isLandingPage?: boolean;
}

const App = ({ Component, pageProps }: AppProps) => {
  const { initialized: authInitialized } = useAuth();
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
          <GlobalStyles />
          <DataProvider>
            <RoutingHistoryProvider>
              <SnackbarProvider>
                <DialogProvider>
                  <ProgressBar />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <App {...props} />
                  </LocalizationProvider>
                </DialogProvider>
              </SnackbarProvider>
            </RoutingHistoryProvider>
          </DataProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default appWithTranslation(AppWrapper);
