import { apiClient } from './client';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  gi: number;
  carbsPer100g: number;
  defaultServingG: number;
  glPerDefaultServing: number;
}

export interface MealLogItem {
  id: string;
  foodItemId: string | null;
  name: string;
  quantity: number;
  unit: string;
  carbsG: number | null;
  gl: number;
  estimated: boolean;
}

export interface MealLog {
  id: string;
  loggedAt: string;
  mealSlot: string;
  totalGl: number;
  notes: string | null;
  items: MealLogItem[];
}

export interface CreateMealPayload {
  loggedAt: string;
  mealSlot: string;
  notes?: string;
  items: Array<{
    foodItemId?: string;
    freeTextName?: string;
    quantity: number;
    unit?: string;
  }>;
}

export async function searchFoods(search: string, limit = 20): Promise<FoodItem[]> {
  const { data } = await apiClient.get<FoodItem[]>('/foods', { params: { search, limit } });
  return data;
}

export async function listMeals(from: string, to: string): Promise<MealLog[]> {
  const { data } = await apiClient.get<MealLog[]>('/meals', { params: { from, to } });
  return data;
}

export async function createMeal(payload: CreateMealPayload): Promise<MealLog> {
  const { data } = await apiClient.post<MealLog>('/meals', payload);
  return data;
}

export async function deleteMeal(id: string): Promise<void> {
  await apiClient.delete(`/meals/${id}`);
}
