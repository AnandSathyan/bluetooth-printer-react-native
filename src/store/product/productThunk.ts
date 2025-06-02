// src/features/product/productThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { submitProductData } from './productApi';

// Async thunk to submit product data
export const submitProduct = createAsyncThunk(
  'product/submitProduct',
  async (productData, thunkAPI) => {
    try {
      const response = await submitProductData(productData);
      
      return response;  // Return the response on success
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
