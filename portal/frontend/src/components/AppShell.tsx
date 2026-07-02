import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  AppBar,
  Avatar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Admin } from '../pages/Admin';
import { ClientDetail } from '../pages/ClientDetail';
import { Coach } from '../pages/Coach';
import { Home } from '../pages/Home';
import { Log } from '../pages/Log';
import { Progress } from '../pages/Progress';
import { brand } from '../theme';

const CORE_NAV = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/log', label: 'Log', icon: <RestaurantIcon /> },
  { path: '/progress', label: 'Progress', icon: <TrendingUpIcon /> },
];

const CLIENT_COACH_NAV = { path: '/coach', label: 'Coach', icon: <MonitorHeartIcon /> };
const ADMIN_NAV = { path: '/admin', label: 'Clients', icon: <PeopleIcon /> };

export function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isCoach = user?.role === 'COACH' || user?.role === 'ADMIN';
  const navItems = useMemo(
    () => (isCoach ? [...CORE_NAV, ADMIN_NAV] : [...CORE_NAV, CLIENT_COACH_NAV]),
    [isCoach],
  );

  const currentIndex = Math.max(
    navItems.findIndex((item) => item.path === location.pathname || location.pathname.startsWith(`${item.path}/`)),
    0,
  );

  const handleNavChange = (_: unknown, index: number) => {
    navigate(navItems[index].path);
  };

  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : '';

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
            sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, flexGrow: 1 }}
          >
            Thrive with Tianna
          </Typography>

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navItems.map((item, index) => (
                <Typography
                  key={item.path}
                  component="button"
                  onClick={() => navigate(item.path)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    opacity: index === currentIndex ? 1 : 0.7,
                    fontWeight: index === currentIndex ? 600 : 400,
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          ) : null}

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: brand.gold, fontSize: '0.85rem' }}>
              {initials}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log" element={<Log />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/coach" element={<Coach />} />
            {isCoach ? <Route path="/admin" element={<Admin />} /> : null}
            {isCoach ? <Route path="/admin/:id" element={<ClientDetail />} /> : null}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>

      {isMobile ? (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={8}>
          <BottomNavigation value={currentIndex} onChange={handleNavChange} showLabels>
            {navItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      ) : null}
    </Box>
  );
}
