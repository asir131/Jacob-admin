import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DatePickerUiState = {
  open: boolean;
  viewDateIso: string;
};

type AdminUiState = {
  notificationDropdownOpen: boolean;
  selectOpenById: Record<string, boolean>;
  datePickerById: Record<string, DatePickerUiState>;
  nftLikedById: Record<string, boolean>;
};

const initialState: AdminUiState = {
  notificationDropdownOpen: false,
  selectOpenById: {},
  datePickerById: {},
  nftLikedById: {},
};

const adminUiSlice = createSlice({
  name: 'adminUi',
  initialState,
  reducers: {
    setNotificationDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationDropdownOpen = action.payload;
    },
    setSelectOpen: (state, action: PayloadAction<{ id: string; open: boolean }>) => {
      state.selectOpenById[action.payload.id] = action.payload.open;
    },
    setDatePickerOpen: (state, action: PayloadAction<{ id: string; open: boolean; fallbackViewDateIso?: string }>) => {
      const current = state.datePickerById[action.payload.id];
      state.datePickerById[action.payload.id] = {
        open: action.payload.open,
        viewDateIso: current?.viewDateIso || action.payload.fallbackViewDateIso || new Date().toISOString(),
      };
    },
    setDatePickerViewDate: (state, action: PayloadAction<{ id: string; viewDateIso: string }>) => {
      const current = state.datePickerById[action.payload.id];
      state.datePickerById[action.payload.id] = {
        open: current?.open || false,
        viewDateIso: action.payload.viewDateIso,
      };
    },
    setNftLiked: (state, action: PayloadAction<{ id: string; liked: boolean }>) => {
      state.nftLikedById[action.payload.id] = action.payload.liked;
    },
  },
});

export const {
  setNotificationDropdownOpen,
  setSelectOpen,
  setDatePickerOpen,
  setDatePickerViewDate,
  setNftLiked,
} = adminUiSlice.actions;

export default adminUiSlice.reducer;
