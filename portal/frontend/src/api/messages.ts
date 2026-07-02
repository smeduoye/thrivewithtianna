import type { Dashboard } from './dashboard';
import type { UserProfile } from './auth';
import { apiClient } from './client';

export interface Message {
  id: string;
  senderId: string | null;
  authorRole: 'client' | 'coach';
  channel: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface ClientDetail {
  profile: UserProfile;
  dashboard: Dashboard;
  unreadFromClient: number;
}

export async function fetchMyThread(): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>('/messages');
  return data;
}

export async function fetchMyUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>('/messages/unread-count');
  return data.count;
}

export async function sendMyMessage(body: string): Promise<Message> {
  const { data } = await apiClient.post<Message>('/messages', { body });
  return data;
}

export async function fetchClientDetail(id: string): Promise<ClientDetail> {
  const { data } = await apiClient.get<ClientDetail>(`/admin/users/${id}`);
  return data;
}

export async function fetchClientThread(id: string): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>(`/admin/users/${id}/messages`);
  return data;
}

export async function sendClientMessage(id: string, body: string): Promise<Message> {
  const { data } = await apiClient.post<Message>(`/admin/users/${id}/messages`, { body });
  return data;
}
