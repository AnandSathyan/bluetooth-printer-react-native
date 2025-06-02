// src/features/modifierDetails/modifierDetailsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchmodifierDetailsFromAPI } from './modifierApi';

interface ModifierDetail {
    RegistrationNo:number,
    ModifierID: string;  // Unique identifier for the modifier, string type for IDs
    ModifierName: string;  // Name of the modifier
    ItemID: string;  // ID of the item the modifier is linked to
    ID: string;  // Unique identifier for the modifier detail record
    IsSync: boolean;  // Sync status, using a boolean (true or false)
    Type: string;  // Type of modifier, can be a code or category (string)
    Display_Price: boolean;  // Whether the price of the modifier should be displayed
    Price: number;  // Price of the modifier, number type for monetary values
    CreatedByID: string;  // ID of the user who created the modifier detail
    CreatedDate: string;  // Creation date of the modifier in ISO string format
    EditedByID: string;  // ID of the user who last edited the modifier detail
    EditedDate: string;  // Date of last edit in ISO string format
}

interface ModifierDetails {
    Param: string;  // Action or selection type, probably "Select"
    ModifierDetail: ModifierDetail;  // Contains all the modifier details
}



export const fetchmodifierDetailsVal = createAsyncThunk<ModifierDetails[], object>(
  'modifierDetails/fetchmodifierDetailsVal',  // Action type
  async (modifierDetailsData, thunkAPI) => {
    try {
      const modifierDetailsVal = await fetchmodifierDetailsFromAPI(modifierDetailsData);
      return modifierDetailsVal;  // Return the fetched modifierDetailsVal
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
