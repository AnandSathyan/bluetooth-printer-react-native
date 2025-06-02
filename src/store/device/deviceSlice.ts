// src/features/device/deviceSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitDevice } from './deviceThunk';

const initialState = {
  device: [],
  loading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitDevice.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(submitDevice.fulfilled, (state:any, action:any) => {
        state.loading = false;
        // Optionally, add the new license to the list of license
        
        state.device.push(action.payload);
      })
      .addCase(submitDevice.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default deviceSlice.reducer;
