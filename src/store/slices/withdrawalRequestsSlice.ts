import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WithdrawalRequestItem = {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  providerAvatar: string;
  providerWalletBalance: number;
  providerTotalEarnings: number;
  providerTotalWithdrawn: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  note: string;
  requestedAt: string | null;
  reviewedAt: string | null;
  processedAt: string | null;
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
};

type WithdrawalState = {
  items: WithdrawalRequestItem[];
  loading: boolean;
  busyWithdrawalId: string;
  selectedWithdrawalId: string;
  reviewNoteDraft: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  notice: {
    type: 'success' | 'error';
    message: string;
  } | null;
};

const initialState: WithdrawalState = {
  items: [],
  loading: false,
  busyWithdrawalId: '',
  selectedWithdrawalId: '',
  reviewNoteDraft: '',
  pagination: {
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  notice: null,
};

type ApiArgs = {
  apiBase: string;
  adminToken: string;
  status?: string;
  page?: number;
  limit?: number;
};

type ReviewArgs = ApiArgs & {
  withdrawalId: string;
  action: 'approve' | 'reject' | 'paid';
  note?: string;
};

export const fetchWithdrawalRequests = createAsyncThunk<
  { items: WithdrawalRequestItem[]; pagination: WithdrawalState['pagination'] },
  ApiArgs,
  { rejectValue: string }
>('withdrawals/fetch', async ({ apiBase, adminToken, status = 'review', page = 1, limit = 8 }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(
      `${apiBase}/api/withdrawals/admin?status=${encodeURIComponent(status)}&page=${encodeURIComponent(
        String(page)
      )}&limit=${encodeURIComponent(String(limit))}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to load withdrawal requests.');
    }
    return {
      items: Array.isArray(payload.data?.items) ? payload.data.items : [],
      pagination: payload.data?.pagination || initialState.pagination,
    };
  } catch {
    return thunkApi.rejectWithValue('Failed to load withdrawal requests.');
  }
});

export const reviewWithdrawalRequest = createAsyncThunk<
  { withdrawalId: string; action: 'approve' | 'reject' | 'paid' },
  ReviewArgs,
  { rejectValue: string }
>('withdrawals/review', async ({ apiBase, adminToken, withdrawalId, action, note = '' }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/withdrawals/admin/${withdrawalId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action, note }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to review withdrawal request.');
    }
    return { withdrawalId, action };
  } catch {
    return thunkApi.rejectWithValue('Failed to review withdrawal request.');
  }
});

const withdrawalRequestsSlice = createSlice({
  name: 'withdrawalRequests',
  initialState,
  reducers: {
    setSelectedWithdrawalId: (state, action: PayloadAction<string>) => {
      state.selectedWithdrawalId = action.payload;
      state.reviewNoteDraft = '';
    },
    setReviewNoteDraft: (state, action: PayloadAction<string>) => {
      state.reviewNoteDraft = action.payload;
    },
    clearWithdrawalNotice: (state) => {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawalRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        if (!action.payload.items.some((item) => item.id === state.selectedWithdrawalId)) {
          state.selectedWithdrawalId = action.payload.items[0]?.id || '';
        }
      })
      .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
        state.loading = false;
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to load withdrawal requests.',
        };
      })
      .addCase(reviewWithdrawalRequest.pending, (state, action) => {
        state.busyWithdrawalId = action.meta.arg.withdrawalId;
      })
      .addCase(reviewWithdrawalRequest.fulfilled, (state, action) => {
        state.busyWithdrawalId = '';
        if (action.payload.action === 'approve') {
          state.items = state.items.map((item) =>
            item.id === action.payload.withdrawalId ? { ...item, status: 'approved' } : item
          );
        } else if (action.payload.action === 'paid' || action.payload.action === 'reject') {
          state.items = state.items.filter((item) => item.id !== action.payload.withdrawalId);
          if (state.selectedWithdrawalId === action.payload.withdrawalId) {
            state.selectedWithdrawalId = state.items[0]?.id || '';
          }
        }
        state.reviewNoteDraft = '';
        state.notice = {
          type: 'success',
          message:
            action.payload.action === 'approve'
              ? 'Withdrawal accepted.'
              : action.payload.action === 'paid'
                ? 'Withdrawal marked as done.'
                : 'Withdrawal rejected.',
        };
      })
      .addCase(reviewWithdrawalRequest.rejected, (state, action) => {
        state.busyWithdrawalId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to review withdrawal request.',
        };
      });
  },
});

export const { setSelectedWithdrawalId, setReviewNoteDraft, clearWithdrawalNotice } =
  withdrawalRequestsSlice.actions;

export default withdrawalRequestsSlice.reducer;
