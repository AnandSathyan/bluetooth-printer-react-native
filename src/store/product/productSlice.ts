// src/features/product/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitProduct } from './productThunk';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitProduct.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(submitProduct.fulfilled, (state:any, action) => {
        state.loading = false;
        // Optionally, add the new product to the list of products
        state.products.push(action.payload);
      })
      .addCase(submitProduct.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default productSlice.reducer;
