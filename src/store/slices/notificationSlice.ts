import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AdminNotification = {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  providerName: string;
  createdAt: string;
  unread: boolean;
};

type NotificationState = {
  items: AdminNotification[];
};

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: 'adminNotifications',
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<AdminNotification>) => {
      state.items = [action.payload, ...state.items].slice(0, 12);
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, unread: false }));
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  pushNotification,
  markAllAsRead,
  clearNotifications,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;
