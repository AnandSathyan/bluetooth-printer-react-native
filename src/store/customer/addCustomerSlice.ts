// import api from "@/app/api/api";
// import { ENDPOINTS } from "@/app/api/apiEndPoint";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async thunk for adding a user
// export const addUser:any = createAsyncThunk(
//   "user/addUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await api.post(ENDPOINTS.ADD_CUSTOMER, userData); // Replace with your API endpoint
//       return response.data;
//     } catch (error:any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     isLoading: false,
//     error: null,
//     success: null,
//   },
//   reducers: {
//     clearStatus: (state) => {
//       state.error = null;
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addUser.pending, (state:any) => {
//         state.isLoading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(addUser.fulfilled, (state:any, action) => {
//         state.isLoading = false;
//         state.success = "User added successfully!";
//       })
//       .addCase(addUser.rejected, (state:any, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "Failed to add user.";
//       });
//   },
// });

// export const { clearStatus } = userSlice.actions;
// export default userSlice.reducer;

import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = "http://74.208.235.72:1001/SelfCheckOutAPI/CustomerMasterAPI";

// Get user by dynamic payload
export const addUser = createAsyncThunk(
  "user/addUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const requestBody = [
        {
          Param: "Insert",
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

const addUserSlice = createSlice({
  name: "adduser",
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
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "User details fetched successfully!";
        state.userData = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
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

export const { clearUserData, setNewCustomer } = addUserSlice.actions;
export default addUserSlice.reducer;
