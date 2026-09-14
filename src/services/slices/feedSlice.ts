import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type FeedData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedData: (state, action: PayloadAction<FeedData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  }
});

export const { setFeedData } = feedSlice.actions;

export const feedReducer = feedSlice.reducer;
