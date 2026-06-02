import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationsReducer from './slices/notificationSlice';
import adminUiReducer from './slices/adminUiSlice';
import tableStateReducer from './slices/tableStateSlice';
import signInReducer from './slices/signInSlice';
import gigApprovalsReducer from './slices/gigApprovalsSlice';
import providerVerificationReducer from './slices/providerVerificationSlice';
import withdrawalRequestsReducer from './slices/withdrawalRequestsSlice';
import faqReducer from './slices/faqSlice';
import supportMessagesReducer from './slices/supportMessagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    adminNotifications: notificationsReducer,
    adminUi: adminUiReducer,
    tableState: tableStateReducer,
    signIn: signInReducer,
    gigApprovals: gigApprovalsReducer,
    providerVerification: providerVerificationReducer,
    withdrawalRequests: withdrawalRequestsReducer,
    faqs: faqReducer,
    supportMessages: supportMessagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
