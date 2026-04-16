import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

type Notice = {
  type: 'success' | 'error';
  message: string;
} | null;

type FaqState = {
  items: FaqItem[];
  loading: boolean;
  saving: boolean;
  deletingId: string;
  editingId: string;
  form: {
    question: string;
    answer: string;
    isActive: boolean;
    sortOrder: number;
  };
  notice: Notice;
};

const initialState: FaqState = {
  items: [],
  loading: false,
  saving: false,
  deletingId: '',
  editingId: '',
  form: {
    question: '',
    answer: '',
    isActive: true,
    sortOrder: 0,
  },
  notice: null,
};

type ApiArgs = {
  apiBase: string;
  adminToken: string;
};

type SaveArgs = ApiArgs & {
  faqId?: string;
  payload: {
    question: string;
    answer: string;
    isActive: boolean;
    sortOrder: number;
  };
};

type DeleteArgs = ApiArgs & {
  faqId: string;
};

export const fetchFaqs = createAsyncThunk<FaqItem[], ApiArgs, { rejectValue: string }>(
  'faqs/fetch',
  async ({ apiBase, adminToken }, thunkApi) => {
    if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
    try {
      const response = await fetch(`${apiBase}/api/faqs/admin`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        return thunkApi.rejectWithValue(payload?.message || 'Failed to load FAQs.');
      }
      return Array.isArray(payload.data) ? payload.data : [];
    } catch {
      return thunkApi.rejectWithValue('Failed to load FAQs.');
    }
  }
);

export const saveFaq = createAsyncThunk<FaqItem, SaveArgs, { rejectValue: string }>(
  'faqs/save',
  async ({ apiBase, adminToken, faqId, payload }, thunkApi) => {
    if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
    try {
      const response = await fetch(`${apiBase}/api/faqs/admin${faqId ? `/${faqId}` : ''}`, {
        method: faqId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        return thunkApi.rejectWithValue(result?.message || 'Failed to save FAQ.');
      }
      return result.data as FaqItem;
    } catch {
      return thunkApi.rejectWithValue('Failed to save FAQ.');
    }
  }
);

export const removeFaq = createAsyncThunk<string, DeleteArgs, { rejectValue: string }>(
  'faqs/remove',
  async ({ apiBase, adminToken, faqId }, thunkApi) => {
    if (!apiBase) return thunkApi.rejectWithValue('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
    try {
      const response = await fetch(`${apiBase}/api/faqs/admin/${faqId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        return thunkApi.rejectWithValue(payload?.message || 'Failed to delete FAQ.');
      }
      return faqId;
    } catch {
      return thunkApi.rejectWithValue('Failed to delete FAQ.');
    }
  }
);

const faqSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    setFaqFormField: (
      state,
      action: PayloadAction<{ field: keyof FaqState['form']; value: string | boolean | number }>
    ) => {
      const { field, value } = action.payload;
      state.form[field] = value as never;
    },
    startEditingFaq: (state, action: PayloadAction<string>) => {
      const faq = state.items.find((item) => item.id === action.payload);
      if (!faq) return;
      state.editingId = faq.id;
      state.form = {
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive,
        sortOrder: faq.sortOrder,
      };
    },
    resetFaqForm: (state) => {
      state.editingId = '';
      state.form = {
        question: '',
        answer: '',
        isActive: true,
        sortOrder: 0,
      };
    },
    clearFaqNotice: (state) => {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to load FAQs.',
        };
      })
      .addCase(saveFaq.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveFaq.fulfilled, (state, action) => {
        state.saving = false;
        const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.items.sort((a, b) => a.sortOrder - b.sortOrder);
        state.editingId = '';
        state.form = initialState.form;
        state.notice = {
          type: 'success',
          message: existingIndex >= 0 ? 'FAQ updated successfully.' : 'FAQ created successfully.',
        };
      })
      .addCase(saveFaq.rejected, (state, action) => {
        state.saving = false;
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to save FAQ.',
        };
      })
      .addCase(removeFaq.pending, (state, action) => {
        state.deletingId = action.meta.arg.faqId;
      })
      .addCase(removeFaq.fulfilled, (state, action) => {
        state.deletingId = '';
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.editingId === action.payload) {
          state.editingId = '';
          state.form = initialState.form;
        }
        state.notice = {
          type: 'success',
          message: 'FAQ deleted successfully.',
        };
      })
      .addCase(removeFaq.rejected, (state, action) => {
        state.deletingId = '';
        state.notice = {
          type: 'error',
          message: action.payload || 'Failed to delete FAQ.',
        };
      });
  },
});

export const { setFaqFormField, startEditingFaq, resetFaqForm, clearFaqNotice } = faqSlice.actions;

export default faqSlice.reducer;
