import { Theme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import Layout from '@common/layout/Layout';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import type {} from '@mui/lab/themeAugmentation';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { DataProvider } from '@common/contexts/DataContext';
import palette from '@common/theme/palette';
import typography from '@common/theme/typography';
import shadows from '@common/theme/shadows';
import ProgressBar from '@common/components/lib/feedbacks/ProgressBar';
import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';
import customShadows from '@common/theme/customShadows';
import SnackbarProvider from '@common/contexts/SnackbarProvider';
import GlobalStyles from '@common/theme/GlobalStyles';
import ComponentsOverrides from '@common/theme/ComponentsOverrides';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import { RoutingHistoryProvider } from '@common/contexts/RoutingHistoryContext';
import { DialogProvider } from '@common/contexts/DialogContext';
import { appWithTranslation } from 'next-i18next';
import { frFR, enUS, esES } from '@mui/material/locale';
import { getUserLanguage } from '@common/components/lib/utils/language';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@common/contexts/ThemeContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
      <Component {...pageProps} />
    </Layout>
  );
};
const AppWrapper = (props: AppProps) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootElement(() => document.querySelector('#__next'));
  }, []);

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
