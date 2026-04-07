export const ADMIN_AUTH_TOKEN_KEY = 'admin_dashboard_token';
export const ADMIN_REFRESH_TOKEN_KEY = 'admin_dashboard_refresh_token';
export const ADMIN_USER_KEY = 'admin_dashboard_user';

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

export const getStoredAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  const refreshToken = localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
  const userValue = localStorage.getItem(ADMIN_USER_KEY);

  if (!accessToken || !refreshToken || !userValue) return null;

  try {
    const user = JSON.parse(userValue) as AdminSession['user'];
    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(getStoredAdminSession());
};

export const storeAdminSession = (session: AdminSession) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, session.accessToken);
  localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session.user));
};

export const clearAdminSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const getStoredAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
};

export const getStoredAdminRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
};
