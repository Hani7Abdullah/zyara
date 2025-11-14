import './i18n'; 

import './index.css';

import ReactDOM from 'react-dom/client';
import { useMemo } from 'react';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useThemeStore } from './store/useThemeStore';
import { useAppStore } from './store/useAppStore';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export function ThemeWrapper() {
  const mode = useThemeStore((s) => s.mode);
  const lang = useAppStore((s) => s.language); // 'en' or 'ar'
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // MUI RTL cache
  const cacheRtl = useMemo(
    () =>
      createCache({
        key: dir === 'rtl' ? 'mui-rtl' : 'mui',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [],
      }),
    [dir]
  );

  // Update HTML dir attribute
  document.documentElement.setAttribute('dir', dir);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ThemeWrapper />
  // </StrictMode>
);
