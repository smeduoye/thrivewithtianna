import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { inviteUser, listUsers } from '../api/admin';
import { apiErrorMessage } from '../api/client';
import { PageHeader } from '../components/PageHeader';

function statusColor(status: string): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'active':
      return 'success';
    case 'trialing':
      return 'warning';
    case 'suspended':
    case 'archived':
      return 'error';
    default:
      return 'default';
  }
}

export function Admin() {
  const queryClient = useQueryClient();
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: listUsers,
  });

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const invite = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setEmail('');
      setFirstName('');
      setLastName('');
      setFormError(null);
    },
    onError: (err) => setFormError(apiErrorMessage(err, 'Could not invite user.')),
  });

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    invite.mutate({ email, firstName, lastName });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Coach"
        title="Client roster"
        subtitle="Invite clients and review who's on the programme. Full client detail and messaging land in M4."
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Invite a client
          </Typography>
          {formError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          ) : null}
          <Box component="form" onSubmit={handleInvite}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <TextField
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                size="small"
              />
              <TextField
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                size="small"
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="small"
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={invite.isPending}>
                {invite.isPending ? 'Inviting…' : 'Invite'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All clients
          </Typography>
          {isLoading ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={20} />
              <Typography>Loading roster…</Typography>
            </Stack>
          ) : null}
          {isError ? (
            <Alert severity="error">{apiErrorMessage(error, 'Could not load users.')}</Alert>
          ) : null}
          {users && users.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Onboarded</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Chip label={u.status} size="small" color={statusColor(u.status)} />
                    </TableCell>
                    <TableCell>{u.onboarded ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {users && users.length === 0 ? (
            <Typography color="text.secondary">No clients yet — invite your first above.</Typography>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  );
}
