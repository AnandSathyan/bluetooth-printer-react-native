// src/features/category/categoryThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesFromAPI } from './categoryApi';

// Define the data type you'll be receiving (adjust it to match your API response)
interface Category 
    {
        "Param": "Select",
        "MenuCategories": {
           "RegistrationNo":"3118",
            "CompanyID": "1",
            "BrandID": "1",
            "BranchID": "1",
            "ID": "0",
            "MenuName": "",
            "POS_ITEM_CAT_ID": "",
            "POS_ITEM_CAT_PARENT": "",
            "POS_ITEM_CAT_NAME": "",
            "E_BUTTON_NAME": "",
            "B_BUTTON_NAME": "",
            "BTN_BACK_COLOR": "",
            "BTN_FORE_COLOR": "",
            "KITCHEN_PRINTER": "",
            "KITCHEN_DISPLAY": "",
            "ItemLogo": "",
            "CreatedByID": "",
            "CreatedDate": "",
            "EditedByID": "",
            "EditedDate": "",
            "ActiveStatus":""
        }
    }


export const fetchCategories = createAsyncThunk<Category[], object>(
  'category/fetchCategories',  // Action type
  async (categoryData, thunkAPI) => {
    try {
      const categories = await fetchCategoriesFromAPI(categoryData);
      return categories;  // Return the fetched categories
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
