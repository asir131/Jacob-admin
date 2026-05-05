import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdminSession } from '@/lib/auth';
import { getStoredAdminSession } from '@/lib/auth';

type AuthState = {
  session: AdminSession | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  session: getStoredAdminSession(),
  hydrated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (_state, action: PayloadAction<AdminSession>) => {
      return {
        session: action.payload,
        hydrated: true,
      };
    },
    clearSession: () => {
      return {
        session: null,
        hydrated: true,
      };
    },
    updateSessionUser: (state, action: PayloadAction<Partial<AdminSession['user']>>) => {
      if (!state.session) return;
      state.session.user = {
        ...state.session.user,
        ...action.payload,
      };
    },
  },
});

export const { setSession, clearSession, updateSessionUser } = authSlice.actions;
export default authSlice.reducer;
