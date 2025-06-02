// src/features/category/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './categoryThunk';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(fetchCategories.fulfilled, (state:any, action) => {
        state.loading = false;
        state.categories = action.payload;  // Store the fetched categories
      })
      .addCase(fetchCategories.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Handle error
      });
  },
});

export default categorySlice.reducer;
