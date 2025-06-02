// src/features/category/categoryAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';

// Function to fetch category data from the API, sending raw JSON in the body
export const fetchCategoriesFromAPI = async (data: any) => {
  try {
    // Sending raw JSON in the body
    const response = await api.post(ENDPOINTS.GET_CATEGORIES, data, {
      headers: {
        'Content-Type': 'application/json',  // Ensure the server expects JSON
      },
    });

    return response.data;  // Return the API response
  } catch (error:any) {
    throw new Error('Error fetching categories: ' + error.message);
  }
};
