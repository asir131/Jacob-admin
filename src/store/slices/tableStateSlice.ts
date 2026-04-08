import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DateRange = {
  start: string;
  end: string;
};

type SharedTableState = {
  searchQuery: string;
  timeFilter: string;
  customRange: DateRange;
  currentPage: number;
  rowsPerPage: number;
  showReportModal: boolean;
};

type CustomerTableState = SharedTableState & {
  statusFilter: string;
  locationFilter: string;
};

type ProviderTableState = SharedTableState & {
  categoryFilter: string;
  ratingFilter: string;
};

type TransactionTableState = SharedTableState & {
  statusFilter: string;
  methodFilter: string;
};

type TableState = {
  customer: CustomerTableState;
  provider: ProviderTableState;
  transaction: TransactionTableState;
};

const sharedDefaults: SharedTableState = {
  searchQuery: '',
  timeFilter: 'All',
  customRange: { start: '', end: '' },
  currentPage: 1,
  rowsPerPage: 10,
  showReportModal: false,
};

const initialState: TableState = {
  customer: {
    ...sharedDefaults,
    statusFilter: 'All',
    locationFilter: 'All',
  },
  provider: {
    ...sharedDefaults,
    categoryFilter: 'All',
    ratingFilter: 'All',
  },
  transaction: {
    ...sharedDefaults,
    statusFilter: 'All',
    methodFilter: 'All',
  },
};

const tableStateSlice = createSlice({
  name: 'tableState',
  initialState,
  reducers: {
    setCustomerSearchQuery: (state, action: PayloadAction<string>) => {
      state.customer.searchQuery = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerStatusFilter: (state, action: PayloadAction<string>) => {
      state.customer.statusFilter = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerLocationFilter: (state, action: PayloadAction<string>) => {
      state.customer.locationFilter = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerTimeFilter: (state, action: PayloadAction<string>) => {
      state.customer.timeFilter = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerCustomRange: (state, action: PayloadAction<DateRange>) => {
      state.customer.customRange = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerCurrentPage: (state, action: PayloadAction<number>) => {
      state.customer.currentPage = action.payload;
    },
    setCustomerRowsPerPage: (state, action: PayloadAction<number>) => {
      state.customer.rowsPerPage = action.payload;
      state.customer.currentPage = 1;
    },
    setCustomerReportModal: (state, action: PayloadAction<boolean>) => {
      state.customer.showReportModal = action.payload;
    },
    resetCustomerTableState: (state) => {
      state.customer = {
        ...sharedDefaults,
        statusFilter: 'All',
        locationFilter: 'All',
      };
    },

    setProviderSearchQuery: (state, action: PayloadAction<string>) => {
      state.provider.searchQuery = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderCategoryFilter: (state, action: PayloadAction<string>) => {
      state.provider.categoryFilter = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderRatingFilter: (state, action: PayloadAction<string>) => {
      state.provider.ratingFilter = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderTimeFilter: (state, action: PayloadAction<string>) => {
      state.provider.timeFilter = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderCustomRange: (state, action: PayloadAction<DateRange>) => {
      state.provider.customRange = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderCurrentPage: (state, action: PayloadAction<number>) => {
      state.provider.currentPage = action.payload;
    },
    setProviderRowsPerPage: (state, action: PayloadAction<number>) => {
      state.provider.rowsPerPage = action.payload;
      state.provider.currentPage = 1;
    },
    setProviderReportModal: (state, action: PayloadAction<boolean>) => {
      state.provider.showReportModal = action.payload;
    },
    resetProviderTableState: (state) => {
      state.provider = {
        ...sharedDefaults,
        categoryFilter: 'All',
        ratingFilter: 'All',
      };
    },

    setTransactionSearchQuery: (state, action: PayloadAction<string>) => {
      state.transaction.searchQuery = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionStatusFilter: (state, action: PayloadAction<string>) => {
      state.transaction.statusFilter = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionMethodFilter: (state, action: PayloadAction<string>) => {
      state.transaction.methodFilter = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionTimeFilter: (state, action: PayloadAction<string>) => {
      state.transaction.timeFilter = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionCustomRange: (state, action: PayloadAction<DateRange>) => {
      state.transaction.customRange = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionCurrentPage: (state, action: PayloadAction<number>) => {
      state.transaction.currentPage = action.payload;
    },
    setTransactionRowsPerPage: (state, action: PayloadAction<number>) => {
      state.transaction.rowsPerPage = action.payload;
      state.transaction.currentPage = 1;
    },
    setTransactionReportModal: (state, action: PayloadAction<boolean>) => {
      state.transaction.showReportModal = action.payload;
    },
    resetTransactionTableState: (state) => {
      state.transaction = {
        ...sharedDefaults,
        statusFilter: 'All',
        methodFilter: 'All',
      };
    },
  },
});

export const {
  setCustomerSearchQuery,
  setCustomerStatusFilter,
  setCustomerLocationFilter,
  setCustomerTimeFilter,
  setCustomerCustomRange,
  setCustomerCurrentPage,
  setCustomerRowsPerPage,
  setCustomerReportModal,
  resetCustomerTableState,
  setProviderSearchQuery,
  setProviderCategoryFilter,
  setProviderRatingFilter,
  setProviderTimeFilter,
  setProviderCustomRange,
  setProviderCurrentPage,
  setProviderRowsPerPage,
  setProviderReportModal,
  resetProviderTableState,
  setTransactionSearchQuery,
  setTransactionStatusFilter,
  setTransactionMethodFilter,
  setTransactionTimeFilter,
  setTransactionCustomRange,
  setTransactionCurrentPage,
  setTransactionRowsPerPage,
  setTransactionReportModal,
  resetTransactionTableState,
} = tableStateSlice.actions;

export default tableStateSlice.reducer;
