import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../index'; // adjust path as needed
// import { ENDPOINTS } from '@/app/api/apiEndPoint';

// Types
// interface CheckoutItem {
//   Param: string;
//   SalesDetail: {
//     RegistrationNo: number;
//     ID: string;
//     CompanyID: string;
//     BrandID: string;
//     BranchID: string;
//     InvNo: string;
//     Date: string;
//     TableNo: number | undefined;
//     TableName: string | undefined;
//     TableLocationID: number | undefined;
//     DetailData: any[];
//     CostInv:any;
//     Tender:any;
//     PaidAmount:any;
//     DiscountID:any;
//     Discount:any;
//     Gtotal:any;
//     TotalTax: any,
//     NetAmount:any;
//     RefundAmt:any;
//     Address:any;
//     Mobile:any;
//     WaiterCommission: any;
//     WaiterCommiPersent: any;
//     TItemTax: any;
               

//   };
// }

// interface CheckoutResponse {
//   success: boolean;
//   message: string;
// }

// interface CheckoutState {
//   items: CheckoutItem[];
//   loading: boolean;
//   error: string | null;
//   response: CheckoutResponse | null;
// }

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  response: null,
};

// Slice
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

// Actions
export const {
  setCheckoutItems,
  setLoading,
  setError,
  setResponse,
} = checkoutSlice.actions;

// Thunk for submitting checkout
export const submitCheckout = (datas) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null)); // Clear previous errors
    dispatch(setResponse(null)); // Clear previous response

    const response = await fetch("http://74.208.235.72:1001/SelfCheckOutAPI/CheckOutAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datas),
    });

    if (!response.ok) {
      throw new Error('Checkout failed');
    }

    const data = await response.json();

    // Save API response
    dispatch(setResponse(data));

    // Optionally clear checkout items if successful
    dispatch(setCheckoutItems([]));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Reducer export
export default checkoutSlice.reducer;
