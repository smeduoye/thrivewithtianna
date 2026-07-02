const TOKEN_KEY = 'thrive.token';

let unauthorizedHandler: (() => void) | null = null;

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  onUnauthorized(handler: () => void): void {
    unauthorizedHandler = handler;
  },
  notifyUnauthorized(): void {
    unauthorizedHandler?.();
  },
};
