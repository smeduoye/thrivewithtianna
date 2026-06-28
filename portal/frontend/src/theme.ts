import { alpha, createTheme } from '@mui/material';

/** Thrive brand — aligned with marketing site styles.css */
export const brand = {
  cream: '#F7F5F0',
  creamDark: '#EDE9E0',
  sage: '#4A6741',
  sageLight: '#6B8F62',
  forest: '#2C3E2D',
  gold: '#C4A574',
  goldLight: '#D4BC94',
  charcoal: '#3D3D3D',
  muted: '#6B6B6B',
  border: '#DDE3DC',
  error: '#C0392B',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.sage,
      light: brand.sageLight,
      dark: brand.forest,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.forest,
      contrastText: '#FFFFFF',
    },
    error: { main: brand.error },
    text: {
      primary: brand.charcoal,
      secondary: brand.muted,
    },
    background: {
      default: brand.cream,
      paper: '#FFFFFF',
    },
    divider: brand.border,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Outfit", system-ui, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", system-ui, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", system-ui, sans-serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.04em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brand.forest,
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '10px 24px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: brand.forest,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${brand.border}`,
          boxShadow: `0 4px 24px ${alpha(brand.forest, 0.08)}`,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${brand.border}`,
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});
