// src/features/license/licenseThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { submitLicenseData } from './licenseApi';

// Async thunk to submit license data
export const submitLicense = createAsyncThunk(
  'license/submitLicense',
  async (licenseData, thunkAPI) => {
    try {
      const response = await submitLicenseData(licenseData);
      return response;  // Return the response on success
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
