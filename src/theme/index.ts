// theme.ts
import { createTheme } from '@mui/material/styles';

const commonSettings = {
  typography: {
    fontFamily: 'Zyara, Arial, sans-serif',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#56A8C1',      // Primary button / main color
      contrastText: '#fff',
    },
    secondary: {
      main: '#CD6028',      // Secondary actions
      contrastText: '#fff',
    },
    success: {
      main: '#70B086',
    },
    warning: {
      main: '#F4B82B',
    },
    text: {
      primary: '#242121',   // Dark text
      secondary: '#5E5F5F', // Subtext
    },
    background: {
      default: '#F8F5FA',   // Light background
      paper: '#fff',
    },
  },
  ...commonSettings,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CD6028',
      contrastText: '#fff',
    },
    secondary: {
      main: '#56A8C1',
      contrastText: '#fff',
    },
    success: {
      main: '#70B086',
    },
    warning: {
      main: '#F4B82B',
    },
    background: {
      default: '#242121',  // Dark background
      paper: '#1e1e1e',
    },
    text: {
      primary: '#F8F5FA',
      secondary: '#A7A7A7',
    },
  },
  ...commonSettings,
});
