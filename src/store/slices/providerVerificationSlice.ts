import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProviderVerificationItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  payoutVerificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  payoutInfo: {
    accountHolderName: string;
    bankAccountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: 'checking' | 'savings' | '';
    nidFrontImageUrl: string;
    nidBackImageUrl: string;
    submittedAt: string | null;
    reviewedAt: string | null;
    rejectionReason: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

type ProviderVerificationState = {
  items: ProviderVerificationItem[];
  loading: boolean;
  busyProviderId: string;
  selectedProviderId: string;
  rejectionReasonDraft: string;
  notice: {
    type: 'success' | 'error';
    message: string;
  } | null;
};

const initialState: ProviderVerificationState = {
  items: [],
  loading: false,
  busyProviderId: '',
  selectedProviderId: '',
  rejectionReasonDraft: '',
  notice: null,
};

type ApiArgs = {
  apiBase: string;
  adminToken: string;
};

type ApproveArgs = ApiArgs & { providerId: string };
type RejectArgs = ApiArgs & { providerId: string; rejectionReason: string };

export const fetchProviderVerifications = createAsyncThunk<
  ProviderVerificationItem[],
  ApiArgs,
  { rejectValue: string }
>('providerVerification/fetch', async ({ apiBase, adminToken }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/profile/admin/provider-verifications?status=pending`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to load provider verifications.');
    }
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return thunkApi.rejectWithValue('Failed to load provider verifications.');
  }
});

export const approveProviderVerification = createAsyncThunk<
  string,
  ApproveArgs,
  { rejectValue: string }
>('providerVerification/approve', async ({ apiBase, adminToken, providerId }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/profile/admin/provider-verifications/${providerId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to approve provider.');
    }
    return providerId;
  } catch {
    return thunkApi.rejectWithValue('Failed to approve provider.');
  }
});

export const rejectProviderVerification = createAsyncThunk<
  string,
  RejectArgs,
  { rejectValue: string }
>('providerVerification/reject', async ({ apiBase, adminToken, providerId, rejectionReason }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/profile/admin/provider-verifications/${providerId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ rejectionReason }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to reject provider.');
    }
    return providerId;
  } catch {
    return thunkApi.rejectWithValue('Failed to reject provider.');
  }
});

const providerVerificationSlice = createSlice({
  name: 'providerVerification',
  initialState,
  reducers: {
    setSelectedProviderId: (state, action: PayloadAction<string>) => {
      state.selectedProviderId = action.payload;
      state.rejectionReasonDraft = '';
    },
    setRejectionReasonDraft: (state, action: PayloadAction<string>) => {
      state.rejectionReasonDraft = action.payload;
    },
    clearProviderVerificationNotice: (state) => {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderVerifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviderVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (!action.payload.some((item) => item.id === state.selectedProviderId)) {
          state.selectedProviderId = action.payload[0]?.id || '';
        }
      })
      .addCase(fetchProviderVerifications.rejected, (state, action) => {
        state.loading = false;
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to load provider verifications.',
        };
      })
      .addCase(approveProviderVerification.pending, (state, action) => {
        state.busyProviderId = action.meta.arg.providerId;
      })
      .addCase(approveProviderVerification.fulfilled, (state, action) => {
        state.busyProviderId = '';
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedProviderId === action.payload) {
          state.selectedProviderId = state.items[0]?.id || '';
        }
        state.notice = {
          type: 'success',
          message: 'Provider verification approved.',
        };
      })
      .addCase(approveProviderVerification.rejected, (state, action) => {
        state.busyProviderId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to approve provider.',
        };
      })
      .addCase(rejectProviderVerification.pending, (state, action) => {
        state.busyProviderId = action.meta.arg.providerId;
      })
      .addCase(rejectProviderVerification.fulfilled, (state, action) => {
        state.busyProviderId = '';
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedProviderId === action.payload) {
          state.selectedProviderId = state.items[0]?.id || '';
        }
        state.rejectionReasonDraft = '';
        state.notice = {
          type: 'success',
          message: 'Provider verification rejected.',
        };
      })
      .addCase(rejectProviderVerification.rejected, (state, action) => {
        state.busyProviderId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to reject provider.',
        };
      });
  },
});

export const { setSelectedProviderId, setRejectionReasonDraft, clearProviderVerificationNotice } =
  providerVerificationSlice.actions;

export default providerVerificationSlice.reducer;
