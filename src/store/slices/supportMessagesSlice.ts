import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
};

export type SupportMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'solved' | 'ignored';
  userId?: string | null;
  conversationId?: string | null;
  user?: SupportUser | null;
  createdAt?: string | null;
};

export type SupportPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type SupportMessagesState = {
  items: SupportMessage[];
  pagination: SupportPagination;
  loading: boolean;
  statusBusyId: string;
  deletingSelected: boolean;
  selectedIds: string[];
  notice: { type: 'success' | 'error'; message: string } | null;
};

const initialPagination: SupportPagination = {
  page: 1,
  limit: 15,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const initialState: SupportMessagesState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  statusBusyId: '',
  deletingSelected: false,
  selectedIds: [],
  notice: null,
};

type ApiArgs = {
  apiBase: string;
  adminToken: string;
  page?: number;
  limit?: number;
};

type UpdateStatusArgs = ApiArgs & {
  id: string;
  status: 'solved' | 'ignored';
};

type DeleteArgs = ApiArgs & {
  ids: string[];
};

export const fetchSupportMessages = createAsyncThunk<
  { items: SupportMessage[]; pagination: SupportPagination },
  ApiArgs,
  { rejectValue: string }
>('supportMessages/fetch', async ({ apiBase, adminToken, page = 1, limit = 15 }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(`${apiBase}/api/support/admin?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to load support messages.');
    }

    return {
      items: Array.isArray(payload?.data?.items) ? payload.data.items : [],
      pagination: payload?.data?.pagination || initialPagination,
    };
  } catch {
    return thunkApi.rejectWithValue('Failed to load support messages.');
  }
});

export const updateSupportStatus = createAsyncThunk<
  { id: string; status: 'solved' | 'ignored'; item?: SupportMessage },
  UpdateStatusArgs,
  { rejectValue: string }
>('supportMessages/updateStatus', async ({ apiBase, adminToken, id, status }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/support/admin/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to update support message.');
    }
    return { id, status, item: payload?.data as SupportMessage | undefined };
  } catch {
    return thunkApi.rejectWithValue('Failed to update support message.');
  }
});

export const deleteSupportMessages = createAsyncThunk<
  { deletedCount: number; ids: string[] },
  DeleteArgs,
  { rejectValue: string }
>('supportMessages/delete', async ({ apiBase, adminToken, ids }, thunkApi) => {
  if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
  try {
    const response = await fetch(`${apiBase}/api/support/admin`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ ids }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      return thunkApi.rejectWithValue(payload?.message || 'Failed to delete selected support messages.');
    }
    return {
      deletedCount: Number(payload?.data?.deletedCount || 0),
      ids: Array.isArray(payload?.data?.ids) ? payload.data.ids : ids,
    };
  } catch {
    return thunkApi.rejectWithValue('Failed to delete selected support messages.');
  }
});

const supportMessagesSlice = createSlice({
  name: 'supportMessages',
  initialState,
  reducers: {
    clearSupportNotice: (state) => {
      state.notice = null;
    },
    setSupportNotice: (state, action: PayloadAction<{ type: 'success' | 'error'; message: string }>) => {
      state.notice = action.payload;
    },
    setSupportPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = Math.max(1, action.payload);
    },
    toggleSupportMessageSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id];
    },
    toggleSupportCurrentPageSelected: (state) => {
      const currentPageIds = state.items.map((item) => item.id);
      const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => state.selectedIds.includes(id));
      state.selectedIds = allSelected
        ? state.selectedIds.filter((id) => !currentPageIds.includes(id))
        : Array.from(new Set([...state.selectedIds, ...currentPageIds]));
    },
    setSupportMessageConversationId: (state, action: PayloadAction<{ id: string; conversationId: string }>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, conversationId: action.payload.conversationId } : item
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupportMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.selectedIds = state.selectedIds.filter((id) => action.payload.items.some((item) => item.id === id));
      })
      .addCase(fetchSupportMessages.rejected, (state, action) => {
        state.loading = false;
        state.notice = { type: 'error', message: action.payload || 'Failed to load support messages.' };
      })
      .addCase(updateSupportStatus.pending, (state, action) => {
        state.statusBusyId = action.meta.arg.id;
      })
      .addCase(updateSupportStatus.fulfilled, (state, action) => {
        state.statusBusyId = '';
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, status: action.payload.item?.status || action.payload.status } : item
        );
        state.notice = { type: 'success', message: `Message marked as ${action.payload.status}.` };
      })
      .addCase(updateSupportStatus.rejected, (state, action) => {
        state.statusBusyId = '';
        state.notice = { type: 'error', message: action.payload || 'Failed to update support message.' };
      })
      .addCase(deleteSupportMessages.pending, (state) => {
        state.deletingSelected = true;
      })
      .addCase(deleteSupportMessages.fulfilled, (state, action) => {
        state.deletingSelected = false;
        const deletedIds = new Set(action.payload.ids);
        state.items = state.items.filter((item) => !deletedIds.has(item.id));
        state.selectedIds = state.selectedIds.filter((id) => !deletedIds.has(id));
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - action.payload.deletedCount);
        state.notice = {
          type: 'success',
          message: `${action.payload.deletedCount || action.payload.ids.length} support message(s) deleted.`,
        };
      })
      .addCase(deleteSupportMessages.rejected, (state, action) => {
        state.deletingSelected = false;
        state.notice = { type: 'error', message: action.payload || 'Failed to delete selected support messages.' };
      });
  },
});

export const {
  clearSupportNotice,
  setSupportNotice,
  setSupportMessageConversationId,
  setSupportPage,
  toggleSupportCurrentPageSelected,
  toggleSupportMessageSelected,
} = supportMessagesSlice.actions;

export default supportMessagesSlice.reducer;
