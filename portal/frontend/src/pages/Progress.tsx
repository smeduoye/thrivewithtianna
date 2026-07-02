import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { listMeals } from '../api/meals';
import { listWeight } from '../api/metrics';
import { apiErrorMessage } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { brand } from '../theme';

function dateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export function Progress() {
  const range = dateRange(7);
  const mealsQuery = useQuery({
    queryKey: ['meals', range.from, range.to],
    queryFn: () => listMeals(range.from, range.to),
  });
  const weightQuery = useQuery({
    queryKey: ['weight', range.from, range.to],
    queryFn: () => listWeight(range.from, range.to),
  });

  const isLoading = mealsQuery.isLoading || weightQuery.isLoading;
  const isError = mealsQuery.isError || weightQuery.isError;
  const error = mealsQuery.error ?? weightQuery.error;

  const glByDay = new Map<string, number>();
  for (const meal of mealsQuery.data ?? []) {
    const day = meal.loggedAt.slice(0, 10);
    glByDay.set(day, (glByDay.get(day) ?? 0) + meal.totalGl);
  }
  const glChartData = Array.from(glByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, gl]) => ({
      date: new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
      gl: Math.round(gl * 10) / 10,
    }));

  const weightChartData = (weightQuery.data ?? [])
    .slice()
    .reverse()
    .map((w) => ({
      date: new Date(w.loggedAt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
      weight: w.weightKg,
    }));

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Progress"
        title="Your trends"
        subtitle="7-day view of glycemic load and weight. Log consistently to see meaningful patterns."
      />

      {isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : null}

      {isError ? (
        <Alert severity="error">{apiErrorMessage(error, 'Could not load progress data.')}</Alert>
      ) : null}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily glycemic load
          </Typography>
          {glChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={glChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={brand.border} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gl"
                  stroke={brand.sage}
                  strokeWidth={2}
                  dot={{ fill: brand.sage }}
                  name="GL"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No meals logged this week yet. Head to Log to add your first meal.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weight
          </Typography>
          {weightChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={brand.border} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke={brand.forest}
                  strokeWidth={2}
                  dot={{ fill: brand.forest }}
                  name="kg"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No weight entries yet. Log your weight on the Log tab.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
