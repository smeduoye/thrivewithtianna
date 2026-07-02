import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { submitOnboarding } from '../api/auth';
import { apiErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/PageHeader';

const PRIMARY_GOALS = [
  'Lower my glycemic load',
  'Lose weight sustainably',
  'Improve energy and sleep',
  'Manage a health condition',
  'Build consistent habits',
];

const CONTACT_CHANNELS = ['WhatsApp', 'Email', 'Portal only'];

const STEPS = ['Your details', 'Your goals', 'Consent'];

export function Onboarding() {
  const { user, setUser, logout } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState(PRIMARY_GOALS[0]);
  const [goalDetail, setGoalDetail] = useState('');
  const [contactChannel, setContactChannel] = useState(CONTACT_CHANNELS[0]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canContinue =
    (activeStep === 0 && firstName.trim() && lastName.trim()) ||
    (activeStep === 1 && primaryGoal) ||
    activeStep === 2;

  const handleNext = () => setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
  const handleBack = () => setActiveStep((step) => Math.max(step - 1, 0));

  const handleSubmit = async () => {
    setError(null);
    if (!consent) {
      setError('Please accept the consent statement to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const profile = await submitOnboarding({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneE164: phone.trim() || undefined,
        goals: { primary: primaryGoal, detail: goalDetail.trim() },
        contactPrefs: { channel: contactChannel },
        consentAccepted: consent,
      });
      setUser(profile);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save onboarding.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 6 }, px: 2 }}>
      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <PageHeader
          eyebrow={`Welcome, ${user?.firstName ?? 'there'}`}
          title="Let's set up your programme"
          subtitle="A few quick details so your coach can tailor your plan. This takes under a minute."
        />

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {activeStep === 0 ? (
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Mobile (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44…"
                  fullWidth
                  helperText="Used for WhatsApp coaching if you choose it."
                />
              </Stack>
            ) : null}

            {activeStep === 1 ? (
              <Stack spacing={2}>
                <TextField
                  select
                  label="Primary goal"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  fullWidth
                >
                  {PRIMARY_GOALS.map((goal) => (
                    <MenuItem key={goal} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Anything your coach should know? (optional)"
                  value={goalDetail}
                  onChange={(e) => setGoalDetail(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField
                  select
                  label="Preferred contact channel"
                  value={contactChannel}
                  onChange={(e) => setContactChannel(e.target.value)}
                  fullWidth
                >
                  {CONTACT_CHANNELS.map((channel) => (
                    <MenuItem key={channel} value={channel}>
                      {channel}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            ) : null}

            {activeStep === 2 ? (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Thrive with Tianna provides nutrition coaching support, not medical treatment.
                  Your logged data is used to personalise your coaching and is handled per our
                  privacy policy. You can request export or deletion at any time.
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />}
                  label="I understand and consent to Thrive processing my data for coaching."
                />
              </Stack>
            ) : null}

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
              <Button color="inherit" onClick={activeStep === 0 ? logout : handleBack} disabled={submitting}>
                {activeStep === 0 ? 'Sign out' : 'Back'}
              </Button>
              {activeStep < STEPS.length - 1 ? (
                <Button variant="contained" onClick={handleNext} disabled={!canContinue}>
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !consent}
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  Finish setup
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
