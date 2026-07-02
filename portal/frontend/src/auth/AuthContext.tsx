import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  fetchMe,
  loginRequest,
  registerRequest,
  type RegisterPayload,
  type UserProfile,
} from '../api/auth';
import { tokenStore } from './token';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const logout = useCallback(() => {
    tokenStore.clear();
    setUserState(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    tokenStore.onUnauthorized(() => {
      setUserState(null);
      setStatus('unauthenticated');
    });
  }, []);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }
    fetchMe()
      .then((profile) => {
        setUserState(profile);
        setStatus('authenticated');
      })
      .catch(() => {
        tokenStore.clear();
        setUserState(null);
        setStatus('unauthenticated');
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    tokenStore.set(response.token);
    setUserState(response.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    tokenStore.set(response.token);
    setUserState(response.user);
    setStatus('authenticated');
  }, []);

  const setUser = useCallback((profile: UserProfile) => {
    setUserState(profile);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout, setUser }),
    [status, user, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
