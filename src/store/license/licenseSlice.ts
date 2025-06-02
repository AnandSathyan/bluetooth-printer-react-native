// src/features/license/licenseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitLicense } from './licenseThunk';

const initialState = {
  license: [],
  loading: false,
  error: null,
};

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitLicense.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(submitLicense.fulfilled, (state:any, action) => {
        state.loading = false;
        // Optionally, add the new license to the list of license
        state.license.push(action.payload);
      })
      .addCase(submitLicense.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default licenseSlice.reducer;
