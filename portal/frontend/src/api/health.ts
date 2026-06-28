import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthResponse> => {
      const { data } = await apiClient.get<HealthResponse>('/health');
      return data;
    },
    refetchInterval: 15_000,
  });
}
