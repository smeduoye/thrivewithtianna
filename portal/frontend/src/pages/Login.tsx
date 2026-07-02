import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { apiErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { brand } from '../theme';

type Mode = 'login' | 'register';

export function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ email, password, firstName, lastName });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(apiErrorMessage(err, isRegister ? 'Could not create account.' : 'Could not sign in.'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={1} sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: '"Cormorant Garamond", serif', color: brand.forest }}
            >
              Thrive with Tianna
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRegister ? 'Create your client account' : 'Sign in to your client portal'}
            </Typography>
          </Stack>

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {isRegister ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                    autoComplete="given-name"
                  />
                  <TextField
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                    autoComplete="family-name"
                  />
                </Stack>
              ) : null}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                helperText={isRegister ? 'At least 8 characters.' : undefined}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isRegister ? 'Create account' : 'Sign in'}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            {isRegister ? 'Already have an account?' : 'New to Thrive?'}{' '}
            <Link component="button" type="button" onClick={toggleMode} underline="hover">
              {isRegister ? 'Sign in' : 'Create one'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
