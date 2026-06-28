import HomeIcon from '@mui/icons-material/Home';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Placeholder } from '../pages/Placeholder';
import { brand } from '../theme';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/log', label: 'Log', icon: <RestaurantIcon /> },
  { path: '/progress', label: 'Progress', icon: <TrendingUpIcon /> },
  { path: '/coach', label: 'Coach', icon: <MonitorHeartIcon /> },
] as const;

export function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(
    NAV_ITEMS.findIndex((item) => item.path === location.pathname) || 0,
  );

  const handleNavChange = (_: unknown, index: number) => {
    setNavValue(index);
    navigate(NAV_ITEMS[index].path);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pb: isMobile ? 7 : 0 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: brand.sage,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              mr: 1.5,
            }}
          >
            T
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            Thrive with Tianna
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: { xs: 'none', sm: 'block' } }}>
            Client portal · MVP
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/log"
              element={<Placeholder title="Log meals" phase="M2 — meal logging & GL" />}
            />
            <Route
              path="/progress"
              element={<Placeholder title="Progress" phase="M2 — charts & streaks" />}
            />
            <Route
              path="/coach"
              element={<Placeholder title="Coach" phase="M4 — messaging" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>

      {isMobile ? (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={8}>
          <BottomNavigation value={navValue} onChange={handleNavChange} showLabels>
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      ) : null}
    </Box>
  );
}
