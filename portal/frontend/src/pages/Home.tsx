import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { fetchDashboard } from '../api/dashboard';
import { apiErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { brand } from '../theme';

function glStatus(todayGl: number, low: number, high: number): 'low' | 'in' | 'high' {
  if (todayGl < low) return 'low';
  if (todayGl > high) return 'high';
  return 'in';
}

export function Home() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });

  const status = data ? glStatus(data.todayGl, data.glTargetLow, data.glTargetHigh) : 'in';
  const glProgress = data
    ? Math.min(100, (data.todayGl / data.glTargetHigh) * 100)
    : 0;

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow={`Hello, ${user?.firstName ?? 'there'}`}
        title="Your Thrive dashboard"
        subtitle={
          data?.primaryGoal
            ? `Goal: ${data.primaryGoal}`
            : 'Log meals to see your daily glycemic load and progress.'
        }
      />

      {isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : null}

      {isError ? (
        <Alert severity="error">{apiErrorMessage(error, 'Could not load dashboard.')}</Alert>
      ) : null}

      {data ? (
        <>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="overline" color="text.secondary">
                    Today's glycemic load
                  </Typography>
                  <Chip
                    size="small"
                    label={`Target ${data.glTargetLow}–${data.glTargetHigh}`}
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="h2" color="primary.main" sx={{ fontWeight: 600 }}>
                  {data.todayGl.toFixed(1)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={glProgress}
                  color={status === 'high' ? 'error' : status === 'in' ? 'primary' : 'inherit'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {data.todayMealsLogged} meal{data.todayMealsLogged !== 1 ? 's' : ''} logged today
                  {data.mealLoggingStreak > 0
                    ? ` · ${data.mealLoggingStreak}-day streak`
                    : ''}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: brand.forest, color: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Suggested next step
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {data.suggestedAction}
              </Typography>
              <Button
                component={RouterLink}
                to="/log"
                variant="contained"
                sx={{ bgcolor: brand.sage, '&:hover': { bgcolor: brand.sageLight } }}
              >
                Go to Log
              </Button>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  7-day avg GL
                </Typography>
                <Typography variant="h4">{data.weekAvgGl.toFixed(1)}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="h4">
                  {data.lastWeightKg != null ? `${data.lastWeightKg} kg` : '—'}
                </Typography>
                {data.weekWeightChangeKg != null ? (
                  <Typography
                    variant="caption"
                    color={data.weekWeightChangeKg <= 0 ? 'success.main' : 'text.secondary'}
                  >
                    {data.weekWeightChangeKg > 0 ? '+' : ''}
                    {data.weekWeightChangeKg} kg this week
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Sleep
                </Typography>
                <Typography variant="h4">
                  {data.lastSleepHours != null ? `${data.lastSleepHours}h` : '—'}
                </Typography>
                {data.lastSleepQuality != null ? (
                  <Typography variant="caption" color="text.secondary">
                    Quality {data.lastSleepQuality}/5
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          </Stack>

          {data.recentMeals.length > 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's meals
                </Typography>
                <Stack spacing={1}>
                  {data.recentMeals.map((meal) => (
                    <Box
                      key={meal.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: `1px solid ${brand.border}`,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {meal.mealSlot}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {meal.items.map((i) => i.name).join(', ')}
                        </Typography>
                      </Box>
                      <Chip label={`${meal.totalGl.toFixed(1)} GL`} size="small" color="primary" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}

      <Typography variant="caption" color="text.secondary" textAlign="center">
        Coaching support, not medical treatment
      </Typography>
    </Stack>
  );
}
