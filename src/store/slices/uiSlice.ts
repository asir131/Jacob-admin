import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  sidebarOpen: boolean;
};

const initialState: UiState = {
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { openSidebar, closeSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
