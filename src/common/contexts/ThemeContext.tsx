import ComponentsOverrides from '@common/theme/ComponentsOverrides';
import customShadows from '@common/theme/customShadows';
import palette from '@common/theme/palette';
import shadows from '@common/theme/shadows';
import typography from '@common/theme/typography';
import createEmotionCache from '@common/utils/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const clientSideEmotionCache = createEmotionCache();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with light theme for SSR
  const [mounted, setMounted] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    // This ensures the hook doesn't run during SSR
    noSsr: true,
    defaultMatches: false,
  });

  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Run after mount to handle client-side preferences
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    } else {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode, mounted]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create theme with current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          ...palette,
          mode,
          ...(mode === 'dark' && {
            background: palette.dark.background,
            text: palette.dark.text,
            action: {
              ...palette.action,
              ...palette.dark.action,
            },
          }),
        },
        typography,
        shape: { borderRadius: 12 },
        shadows,
        customShadows,
        components: ComponentsOverrides,
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1200,
            xl: 1920,
          },
        },
      }),
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode]
  );

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeContext.Provider value={contextValue}>
        <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
