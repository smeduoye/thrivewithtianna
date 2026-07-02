import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { apiErrorMessage } from '../api/client';
import { createMeal, searchFoods, type FoodItem } from '../api/meals';
import { logSleep, logWeight } from '../api/metrics';
import { PageHeader } from '../components/PageHeader';

const MEAL_SLOTS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

interface DraftItem {
  key: string;
  food?: FoodItem;
  freeTextName?: string;
  quantity: number;
}

function todayIso(): string {
  return new Date().toISOString();
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Log() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Meal state
  const [mealSlot, setMealSlot] = useState('breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);

  // Weight state
  const [weightKg, setWeightKg] = useState('');

  // Sleep state
  const [sleepHours, setSleepHours] = useState('7');
  const [sleepQuality, setSleepQuality] = useState('4');

  const { data: foods = [], isFetching: foodsLoading } = useQuery({
    queryKey: ['foods', foodSearch],
    queryFn: () => searchFoods(foodSearch, 15),
    enabled: foodSearch.length >= 2,
  });

  const draftGl = useMemo(() => {
    return draftItems.reduce((sum, item) => {
      if (item.food) {
        const carbs = (item.food.carbsPer100g * item.quantity) / 100;
        return sum + (item.food.gi * carbs) / 100;
      }
      return sum;
    }, 0);
  }, [draftItems]);

  const mealMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setDraftItems([]);
      setSuccess('Meal logged successfully.');
      setError(null);
    },
    onError: (err) => setError(apiErrorMessage(err, 'Could not log meal.')),
  });

  const weightMutation = useMutation({
    mutationFn: () => logWeight(todayIso(), parseFloat(weightKg)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['weight'] });
      setWeightKg('');
      setSuccess('Weight logged.');
      setError(null);
    },
    onError: (err) => setError(apiErrorMessage(err, 'Could not log weight.')),
  });

  const sleepMutation = useMutation({
    mutationFn: () =>
      logSleep(todayDate(), parseFloat(sleepHours), parseInt(sleepQuality, 10)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sleep'] });
      setSuccess('Sleep logged.');
      setError(null);
    },
    onError: (err) => setError(apiErrorMessage(err, 'Could not log sleep.')),
  });

  const addFoodItem = () => {
    if (!selectedFood) return;
    setDraftItems((items) => [
      ...items,
      {
        key: `${selectedFood.id}-${Date.now()}`,
        food: selectedFood,
        quantity: parseFloat(quantity) || selectedFood.defaultServingG,
      },
    ]);
    setSelectedFood(null);
    setFoodSearch('');
    setQuantity('100');
  };

  const submitMeal = () => {
    if (draftItems.length === 0) {
      setError('Add at least one food item.');
      return;
    }
    mealMutation.mutate({
      loggedAt: todayIso(),
      mealSlot,
      items: draftItems.map((item) => ({
        foodItemId: item.food?.id,
        freeTextName: item.freeTextName,
        quantity: item.quantity,
        unit: 'g',
      })),
    });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Log"
        title="Track your day"
        subtitle="Log meals to see your daily glycemic load. Weight and sleep help your coach spot patterns."
      />

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      ) : null}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
        <Tab label="Meals" />
        <Tab label="Weight" />
        <Tab label="Sleep" />
      </Tabs>

      {tab === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                select
                label="Meal"
                value={mealSlot}
                onChange={(e) => setMealSlot(e.target.value)}
                fullWidth
              >
                {MEAL_SLOTS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                options={foods}
                loading={foodsLoading}
                getOptionLabel={(o) => o.name}
                inputValue={foodSearch}
                onInputChange={(_, v) => setFoodSearch(v)}
                value={selectedFood}
                onChange={(_, v) => setSelectedFood(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search food"
                    placeholder="Type at least 2 characters…"
                    helperText="Thrive-curated database — 225+ low-GL foods"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id}>
                    <Stack>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        GI {option.gi} · GL ~{option.glPerDefaultServing.toFixed(1)} per{' '}
                        {option.defaultServingG}g
                      </Typography>
                    </Stack>
                  </Box>
                )}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Quantity (g)"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={addFoodItem} disabled={!selectedFood}>
                  Add
                </Button>
              </Stack>

              {draftItems.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Items ({draftGl.toFixed(1)} GL total)
                  </Typography>
                  <Stack spacing={1}>
                    {draftItems.map((item) => (
                      <Stack
                        key={item.key}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2">
                          {item.food?.name} — {item.quantity}g
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDraftItems((items) => items.filter((i) => i.key !== item.key))
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submitMeal}
                    disabled={mealMutation.isPending}
                    startIcon={mealMutation.isPending ? <CircularProgress size={18} /> : null}
                  >
                    Log {MEAL_SLOTS.find((s) => s.value === mealSlot)?.label}
                  </Button>
                </Box>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {tab === 1 ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Weight (kg)"
                type="number"
                inputProps={{ step: 0.1, min: 30, max: 300 }}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                size="large"
                onClick={() => weightMutation.mutate()}
                disabled={!weightKg || weightMutation.isPending}
              >
                Log weight
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {tab === 2 ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Hours slept"
                type="number"
                inputProps={{ step: 0.5, min: 1, max: 24 }}
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Sleep quality (1–5)"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                fullWidth
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <MenuItem key={n} value={String(n)}>
                    {n} {n === 1 ? '(poor)' : n === 5 ? '(excellent)' : ''}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                size="large"
                onClick={() => sleepMutation.mutate()}
                disabled={sleepMutation.isPending}
              >
                Log sleep
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
