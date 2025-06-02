// store/slices/apiSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    }
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, resetData } = apiSlice.actions;
export default apiSlice.reducer;
