import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = "http://74.208.235.72:1001/SelfCheckOutAPI/CustomerMasterAPI";

// Get user by dynamic payload
export const getUser = createAsyncThunk(
  "user/getUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const requestBody = [
        {
          Param: "Select",
          CustomerMaster: payload, // Payload should at least have RegistrationNo
        },
      ];

      const response = await axios.post(API_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.data) {
        return rejectWithValue("Empty response from server.");
      }

      return response.data; // return the response directly
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

// Add new customer
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

interface GetUserState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  userData: any;
  newCustomer: any;
}

const initialState: GetUserState = {
  isLoading: false,
  error: null,
  success: null,
  userData: null,
  newCustomer: null,
};

const getUserSlice = createSlice({
  name: "getuser",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.error = null;
      state.success = null;
      state.isLoading = false;
    },
    setNewCustomer: (state, action: PayloadAction<any>) => {
      state.newCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "User details fetched successfully!";
        state.userData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "User added successfully!";
        state.userData = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData, setNewCustomer } = getUserSlice.actions;
export default getUserSlice.reducer;
