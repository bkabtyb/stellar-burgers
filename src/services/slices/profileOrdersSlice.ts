import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

type ProfileOrdersPayload = {
  orders: TOrder[];
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setProfileOrders: (state, action: PayloadAction<ProfileOrdersPayload>) => {
      state.orders = action.payload.orders;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить историю заказов';
      });
  }
});

export const { setProfileOrders } = profileOrdersSlice.actions;

export const profileOrdersReducer = profileOrdersSlice.reducer;
