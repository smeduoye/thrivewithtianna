import type { UserProfile } from './auth';
import { apiClient } from './client';

export interface InvitePayload {
  email: string;
  firstName: string;
  lastName: string;
  role?: 'CLIENT' | 'COACH' | 'ADMIN';
  portalTier?: 'full' | 'lite' | 'none';
}

export async function listUsers(): Promise<UserProfile[]> {
  const { data } = await apiClient.get<UserProfile[]>('/admin/users');
  return data;
}

export async function inviteUser(payload: InvitePayload): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>('/admin/users', payload);
  return data;
}
