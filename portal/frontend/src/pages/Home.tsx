import {
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useHealth } from '../api/health';
import { PageHeader } from '../components/PageHeader';
import { brand } from '../theme';

const ROADMAP = [
  { id: 'M0', label: 'Foundation scaffold', status: 'active' as const },
  { id: 'M1', label: 'Auth & onboarding', status: 'planned' as const },
  { id: 'M2', label: 'Logging & GL dashboard', status: 'planned' as const },
  { id: 'M3', label: 'Stripe billing', status: 'planned' as const },
  { id: 'M4', label: 'Coach messaging', status: 'planned' as const },
  { id: 'M5', label: 'Oracle production deploy', status: 'planned' as const },
];

export function Home() {
  const { data, isLoading, isError, error } = useHealth();

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Welcome"
        title="Your Thrive dashboard"
        subtitle="Foundation release — confirming API connectivity and mobile-first shell before meal logging and coaching features land."
      />

      <Card>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            API status
          </Typography>
          {isLoading ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <CircularProgress size={24} />
              <Typography>Connecting to backend…</Typography>
            </Stack>
          ) : null}
          {isError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              Could not reach the API. Start the stack with{' '}
              <code>docker compose up</code> in <code>portal/</code>.
              {error instanceof Error ? ` (${error.message})` : null}
            </Alert>
          ) : null}
          {data ? (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="h5" color="primary.main">
                {data.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Service: {data.service}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last check: {new Date(data.timestamp).toLocaleString()}
              </Typography>
            </Stack>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            MVP roadmap
          </Typography>
          <Stack spacing={1}>
            {ROADMAP.map((item) => (
              <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                <Chip
                  label={item.id}
                  size="small"
                  color={item.status === 'active' ? 'primary' : 'default'}
                  variant={item.status === 'active' ? 'filled' : 'outlined'}
                />
                <Typography variant="body2">{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="caption" color="text.secondary" textAlign="center">
        Coaching support, not medical treatment · {brand.sage}
      </Typography>
    </Stack>
  );
}
