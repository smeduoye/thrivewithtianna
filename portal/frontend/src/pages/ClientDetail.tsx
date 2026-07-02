import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { apiErrorMessage } from '../api/client';
import { fetchClientDetail, fetchClientThread, sendClientMessage } from '../api/messages';
import { MessageThread } from '../components/MessageThread';
import { PageHeader } from '../components/PageHeader';

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
}

export function ClientDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const detail = useQuery({
    queryKey: ['admin', 'client', id],
    queryFn: () => fetchClientDetail(id),
    enabled: Boolean(id),
  });

  const thread = useQuery({
    queryKey: ['admin', 'client', id, 'messages'],
    queryFn: () => fetchClientThread(id),
    enabled: Boolean(id),
  });

  const send = useMutation({
    mutationFn: (body: string) => sendClientMessage(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'client', id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'client', id] });
    },
  });

  if (detail.isLoading) {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <CircularProgress size={20} />
        <Typography>Loading client…</Typography>
      </Stack>
    );
  }

  if (detail.isError || !detail.data) {
    return <Alert severity="error">{apiErrorMessage(detail.error, 'Could not load this client.')}</Alert>;
  }

  const { profile, dashboard } = detail.data;
  const weight = dashboard.lastWeightKg != null ? `${dashboard.lastWeightKg} kg` : '—';
  const sleep = dashboard.lastSleepHours != null ? `${dashboard.lastSleepHours} h` : '—';

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin')}
        sx={{ alignSelf: 'flex-start' }}
        size="small"
      >
        Back to roster
      </Button>

      <PageHeader
        eyebrow="Client"
        title={`${profile.firstName} ${profile.lastName}`}
        subtitle={profile.email}
      />

      <Card>
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
            <Chip label={profile.status} size="small" color="success" />
            <Chip label={profile.onboarded ? 'Onboarded' : 'Not onboarded'} size="small" />
            {dashboard.primaryGoal ? (
              <Chip label={`Goal: ${dashboard.primaryGoal}`} size="small" variant="outlined" />
            ) : null}
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Metric label="Today's GL" value={String(dashboard.todayGl)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Metric label="7-day avg GL" value={String(dashboard.weekAvgGl)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Metric label="Logging streak" value={`${dashboard.mealLoggingStreak} d`} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Metric label="Meals today" value={String(dashboard.todayMealsLogged)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Metric label="Latest weight" value={weight} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Metric label="Latest sleep" value={sleep} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Metric label="GL target band" value={`${dashboard.glTargetLow}–${dashboard.glTargetHigh}`} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conversation
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {thread.isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiErrorMessage(thread.error, 'Could not load the conversation.')}
            </Alert>
          ) : null}
          {send.isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiErrorMessage(send.error, 'Could not send your reply.')}
            </Alert>
          ) : null}
          <MessageThread
            messages={thread.data ?? []}
            viewerRole="coach"
            onSend={(body) => send.mutate(body)}
            sending={send.isPending}
            isLoading={thread.isLoading}
            emptyHint="No messages yet. Send the first note to your client."
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
