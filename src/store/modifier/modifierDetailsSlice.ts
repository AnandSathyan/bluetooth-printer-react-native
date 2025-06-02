// src/features/modifierDetails/modifierDetailsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchmodifierDetailsVal } from './modifierThunk';

const initialState = {
  modifierDetails: [],
  loading: false,
  error: null,
};

const modifierDetailsSlice = createSlice({
  name: 'modifierDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchmodifierDetailsVal.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(fetchmodifierDetailsVal.fulfilled, (state:any, action) => {
        state.loading = false;
        state.modifierDetails = action.payload;  // Store the fetched modifierDetails
      })
      .addCase(fetchmodifierDetailsVal.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Handle error
      });
  },
});

export default modifierDetailsSlice.reducer;
