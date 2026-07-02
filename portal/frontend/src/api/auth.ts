import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneE164: string | null;
  role: 'CLIENT' | 'COACH' | 'ADMIN';
  status: string;
  portalTier: string;
  programme: string | null;
  goals: Record<string, unknown>;
  contactPrefs: Record<string, unknown>;
  onboarded: boolean;
  onboardedAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  user: UserProfile;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  phoneE164?: string;
  goals: Record<string, unknown>;
  contactPrefs: Record<string, unknown>;
  consentAccepted: boolean;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function fetchMe(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/me');
  return data;
}

export async function submitOnboarding(payload: OnboardingPayload): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>('/onboarding', payload);
  return data;
}
