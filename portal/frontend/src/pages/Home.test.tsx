import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
import { Home } from './Home';

vi.mock('../api/dashboard', () => ({
  fetchDashboard: vi.fn().mockResolvedValue({
    primaryGoal: 'Lower my glycemic load',
    glTargetLow: 45,
    glTargetHigh: 55,
    todayGl: 32,
    todayMealsLogged: 1,
    mealLoggingStreak: 2,
    lastWeightKg: 80,
    lastWeightAt: '2026-07-02T10:00:00Z',
    lastSleepHours: 7.5,
    lastSleepQuality: 4,
    suggestedAction: 'Log your first meal today',
    recentMeals: [],
    weekAvgGl: 40,
    weekWeightChangeKg: -0.5,
  }),
}));

vi.mock('../auth/AuthContext', async () => {
  const actual = await vi.importActual('../auth/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'CLIENT',
        onboarded: true,
      },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
    }),
  };
});

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Home', () => {
  it('renders dashboard heading', async () => {
    renderHome();
    expect(await screen.findByRole('heading', { name: /your thrive dashboard/i })).toBeInTheDocument();
  });
});
