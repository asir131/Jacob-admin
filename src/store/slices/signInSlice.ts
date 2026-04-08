import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storeAdminSession, type AdminSession } from '@/lib/auth';

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
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
};

type SignInState = {
  showPassword: boolean;
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
};

const initialState: SignInState = {
  showPassword: false,
  email: '',
  password: '',
  error: '',
  isSubmitting: false,
};

export const submitAdminLogin = createAsyncThunk<
  AdminSession,
  { apiBaseUrl: string; email: string; password: string },
  { rejectValue: string }
>('signIn/submitAdminLogin', async ({ apiBaseUrl, email, password }, thunkApi) => {
  if (!apiBaseUrl) {
    return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const payload = (await response.json()) as LoginResponse;
    if (!response.ok || !payload.success || !payload.data) {
      return thunkApi.rejectWithValue(payload.message || 'Invalid admin email or password.');
    }

    if (payload.data.user.role !== 'superAdmin') {
      return thunkApi.rejectWithValue('Only super admin can access the admin dashboard.');
    }

    const session: AdminSession = {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      user: payload.data.user,
    };

    storeAdminSession(session);
    return session;
  } catch (error) {
    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Sign in failed.');
  }
});

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    setShowPassword: (state, action: PayloadAction<boolean>) => {
      state.showPassword = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    clearSignInError: (state) => {
      state.error = '';
    },
    resetSignInForm: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdminLogin.pending, (state) => {
        state.error = '';
        state.isSubmitting = true;
      })
      .addCase(submitAdminLogin.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(submitAdminLogin.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Sign in failed.';
      });
  },
});

export const { setShowPassword, setEmail, setPassword, clearSignInError, resetSignInForm } = signInSlice.actions;
export default signInSlice.reducer;
