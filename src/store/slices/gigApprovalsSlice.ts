import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PendingGigRequest = {
  _id: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  customCategoryName?: string;
  customCategoryDescription?: string;
  customCategoryIconName?: string;
  description?: string;
  requirements?: string;
  packages?: Array<{
    name?: string;
    title?: string;
    description?: string;
    deliveryTime?: string;
    price?: number;
  }>;
  images?: string[];
  baseCity?: string;
  locationLat?: number | null;
  locationLng?: number | null;
  travelRadiusKm?: number | null;
  status?: string;
  createdAt?: string;
  rejectionReason?: string;
  providerId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
};

type Notice = {
  type: 'success' | 'error';
  message: string;
} | null;

type GigApprovalsState = {
  pendingRequests: PendingGigRequest[];
  loading: boolean;
  selectedRequestId: string;
  selectedIcons: Record<string, string>;
  rejectionReasons: Record<string, string>;
  busyRequestId: string;
  notice: Notice;
};

const initialState: GigApprovalsState = {
  pendingRequests: [],
  loading: false,
  selectedRequestId: '',
  selectedIcons: {},
  rejectionReasons: {},
  busyRequestId: '',
  notice: null,
};

type RequestArgs = {
  apiBase: string;
  adminToken?: string;
};

type ApprovalArgs = RequestArgs & {
  id: string;
  iconName: string;
};

type RejectionArgs = RequestArgs & {
  id: string;
  rejectionReason: string;
};

export const fetchPendingGigApprovals = createAsyncThunk<
  PendingGigRequest[],
  RequestArgs,
  { rejectValue: string }
>('gigApprovals/fetchPending', async ({ apiBase, adminToken }, thunkApi) => {
  if (!apiBase) {
    return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  }

  try {
    const response = await fetch(`${apiBase}/api/gigs/pending`, {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined,
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Could not load pending approvals.');
    }
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return thunkApi.rejectWithValue('Could not load pending approvals.');
  }
});

export const approveGigRequest = createAsyncThunk<
  string,
  ApprovalArgs,
  { rejectValue: string }
>('gigApprovals/approve', async ({ apiBase, adminToken, id, iconName }, thunkApi) => {
  if (!apiBase) {
    return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  }

  try {
    const response = await fetch(`${apiBase}/api/gigs/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: JSON.stringify({ iconName }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Could not approve request.');
    }
    return id;
  } catch {
    return thunkApi.rejectWithValue('Could not approve request.');
  }
});

export const rejectGigRequest = createAsyncThunk<
  string,
  RejectionArgs,
  { rejectValue: string }
>('gigApprovals/reject', async ({ apiBase, adminToken, id, rejectionReason }, thunkApi) => {
  if (!apiBase) {
    return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  }

  try {
    const response = await fetch(`${apiBase}/api/gigs/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: JSON.stringify({ rejectionReason }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Could not reject request.');
    }
    return id;
  } catch {
    return thunkApi.rejectWithValue('Could not reject request.');
  }
});

const gigApprovalsSlice = createSlice({
  name: 'gigApprovals',
  initialState,
  reducers: {
    setSelectedRequestId: (state, action: PayloadAction<string>) => {
      state.selectedRequestId = action.payload;
    },
    setSelectedIcon: (state, action: PayloadAction<{ requestId: string; iconName: string }>) => {
      state.selectedIcons[action.payload.requestId] = action.payload.iconName;
    },
    clearSelectedIcon: (state, action: PayloadAction<string>) => {
      delete state.selectedIcons[action.payload];
    },
    setRejectionReason: (state, action: PayloadAction<{ requestId: string; value: string }>) => {
      state.rejectionReasons[action.payload.requestId] = action.payload.value;
    },
    clearNotice: (state) => {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingGigApprovals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingGigApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
        if (!action.payload.some((request) => request._id === state.selectedRequestId)) {
          state.selectedRequestId = action.payload[0]?._id || '';
        }
      })
      .addCase(fetchPendingGigApprovals.rejected, (state, action) => {
        state.loading = false;
        state.pendingRequests = [];
        state.notice = {
          type: 'error',
          message: action.payload || 'Could not load pending approvals.',
        };
      })
      .addCase(approveGigRequest.pending, (state, action) => {
        state.busyRequestId = action.meta.arg.id;
      })
      .addCase(approveGigRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.busyRequestId = '';
        state.notice = {
          type: 'success',
          message: 'Approved and added to categories.',
        };
        state.pendingRequests = state.pendingRequests.filter((request) => request._id !== id);
        delete state.selectedIcons[id];
        delete state.rejectionReasons[id];
        if (state.selectedRequestId === id) {
          state.selectedRequestId = state.pendingRequests[0]?._id || '';
        }
      })
      .addCase(approveGigRequest.rejected, (state, action) => {
        state.busyRequestId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Could not approve request.',
        };
      })
      .addCase(rejectGigRequest.pending, (state, action) => {
        state.busyRequestId = action.meta.arg.id;
      })
      .addCase(rejectGigRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.busyRequestId = '';
        state.notice = {
          type: 'success',
          message: 'Gig request rejected.',
        };
        state.pendingRequests = state.pendingRequests.filter((request) => request._id !== id);
        delete state.selectedIcons[id];
        delete state.rejectionReasons[id];
        if (state.selectedRequestId === id) {
          state.selectedRequestId = state.pendingRequests[0]?._id || '';
        }
      })
      .addCase(rejectGigRequest.rejected, (state, action) => {
        state.busyRequestId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Could not reject request.',
        };
      });
  },
});

export const { setSelectedRequestId, setSelectedIcon, clearSelectedIcon, setRejectionReason, clearNotice } =
  gigApprovalsSlice.actions;
export default gigApprovalsSlice.reducer;
