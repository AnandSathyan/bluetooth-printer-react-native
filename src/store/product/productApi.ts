// src/features/product/productAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';
import qs from 'qs'

const productData =  {
    RegistrationNo:"3118",
    Pass: 'Admin',
    CompanyID: '1',
    BrandID: '1',
  }
  // console.log("working");
  
// Function to send x-www-form-urlencoded data in a POST request
export const submitProductData = async (data: any) => {
  try {
    const response = await api.post(
      ENDPOINTS.FETCH_PRODUCTS,
      qs.stringify(productData), // converts it to key=value&... format
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
    
  } catch (error: any) {
    throw new Error('Error submitting product data: ' + error.message);
  }
};
