import { apiClient } from './client';

export interface WeightLog {
  id: string;
  loggedAt: string;
  weightKg: number;
}

export interface SleepLog {
  id: string;
  logDate: string;
  hours: number;
  quality: number | null;
}

export interface SymptomLog {
  id: string;
  loggedAt: string;
  symptom: string;
  severity: string;
  notes: string | null;
}

export async function logWeight(loggedAt: string, weightKg: number): Promise<WeightLog> {
  const { data } = await apiClient.post<WeightLog>('/weight', { loggedAt, weightKg });
  return data;
}

export async function listWeight(from: string, to: string): Promise<WeightLog[]> {
  const { data } = await apiClient.get<WeightLog[]>('/weight', { params: { from, to } });
  return data;
}

export async function logSleep(
  logDate: string,
  hours: number,
  quality?: number,
): Promise<SleepLog> {
  const { data } = await apiClient.post<SleepLog>('/sleep', { logDate, hours, quality });
  return data;
}

export async function listSleep(from: string, to: string): Promise<SleepLog[]> {
  const { data } = await apiClient.get<SleepLog[]>('/sleep', { params: { from, to } });
  return data;
}

export async function logSymptom(
  loggedAt: string,
  symptom: string,
  severity: string,
  notes?: string,
): Promise<SymptomLog> {
  const { data } = await apiClient.post<SymptomLog>('/symptoms', {
    loggedAt,
    symptom,
    severity,
    notes,
  });
  return data;
}

export async function listSymptoms(from: string, to: string): Promise<SymptomLog[]> {
  const { data } = await apiClient.get<SymptomLog[]>('/symptoms', { params: { from, to } });
  return data;
}
