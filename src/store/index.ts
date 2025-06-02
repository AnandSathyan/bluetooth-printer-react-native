import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

// Import slices
// import apiReducer from '../slices/apiSlice';
import licenceReducer from './license/licenseSlice';
import categoryReducer from './category/categorySlice';
import productReducer from './product/productSlice';
import cartReducer from './cart/cartSlice';
import getUserReducer from './customer/getCustomerSlice';
import deviceReducer from './device/deviceSlice';
import customerReducer from './customer/getCustomerSlice';
import checkoutReducer from './checkout/checkoutSlice';
import modifierCategoryReducer from './modifier/modifierCategorySlice';
import modifierDescriptionReducer from './modifier/modifierDetailsSlice';

const store = configureStore({
  reducer: {
    // api: apiReducer,
    licence: licenceReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    getUserDetails: getUserReducer,
    device: deviceReducer,
    customer: customerReducer,
    checkout: checkoutReducer,
    modifierCategory: modifierCategoryReducer,
    modifierDescription: modifierDescriptionReducer,
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
