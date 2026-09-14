import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from '../slices/ingredientsSlice';
import { userReducer } from '../slices/userSlice';
import { constructorReducer } from '../slices/constructorSlice';
import { orderReducer } from '../slices/orderSlice';
import { feedReducer } from '../slices/feedSlice';
import { orderDetailsReducer } from '../slices/orderDetailsSlice';
import { profileOrdersReducer } from '../slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  orderDetails: orderDetailsReducer,
  profileOrders: profileOrdersReducer
});
