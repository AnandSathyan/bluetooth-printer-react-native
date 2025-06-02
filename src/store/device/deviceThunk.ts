// src/features/device/deviceThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { submitDeviceData } from './deviceApi';

// Async thunk to submit device data
export const submitDevice = createAsyncThunk(
  'device/submitDevice',
  async (deviceData, thunkAPI) => {
    try {
      const response = await submitDeviceData(deviceData);
      return response;  // Return the response on success
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
