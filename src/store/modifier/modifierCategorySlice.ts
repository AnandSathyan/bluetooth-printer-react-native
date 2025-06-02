// src/features/modifierCategory/modifierCategorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchmodifierCategoryVal } from './modifierCategoryThunk';

const initialState = {
  modifierCategory: [],
  loading: false,
  error: null,
};

const modifierCategorySlice = createSlice({
  name: 'modifierCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchmodifierCategoryVal.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(fetchmodifierCategoryVal.fulfilled, (state:any, action) => {
        state.loading = false;
        state.modifierCategory = action.payload;  // Store the fetched modifierCategory
      })
      .addCase(fetchmodifierCategoryVal.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Handle error
      });
  },
});

export default modifierCategorySlice.reducer;
