import { apiClient } from './client';
import type { MealLog } from './meals';

export interface Dashboard {
  primaryGoal: string | null;
  glTargetLow: number;
  glTargetHigh: number;
  todayGl: number;
  todayMealsLogged: number;
  mealLoggingStreak: number;
  lastWeightKg: number | null;
  lastWeightAt: string | null;
  lastSleepHours: number | null;
  lastSleepQuality: number | null;
  suggestedAction: string;
  recentMeals: MealLog[];
  weekAvgGl: number;
  weekWeightChangeKg: number | null;
}

export async function fetchDashboard(): Promise<Dashboard> {
  const { data } = await apiClient.get<Dashboard>('/dashboard');
  return data;
}
