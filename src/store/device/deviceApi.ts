// src/features/device/deviceAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';


const deviceData =  [
  {
      "Param": "Select",
      "DeviceDetail": {
        "RegistrationNo":"3118",
          "Company_Id": "",
          "Brand_Id": "",
          "Location_Id": "",
          "Device_Name": "",
          "Device_Name_L": "",
          "IP_Address": "",
          "Port": "",
          "Communication_Type": "",
          "Field1": "",
          "Field2": "",
          "Field3": "",
          "Field4": "",
          "Field5": "",
          "Field6": "",
          "Field7": "",
          "IsActive": "",
          "CreatedBy": "",
          "CreatedDate": "",
          "ModifiedBy": "",
          "ModifiedDate": ""
      }
  }
]

// Function to send x-www-form-urlencoded data in a POST request
export const submitDeviceData = async (data: any) => {
  try {
    // Serialize the data into x-www-form-urlencoded format using qs
    // const formData = qs.stringify(deviceData);

    // Make the POST request
    const response = await api.post(ENDPOINTS.GET_DEVICE_INFO, deviceData, {
      headers: {
        'Content-Type': 'application/json',  // Set content type
      },
    });

    return response.data;  // Return the API response
  } catch (error:any) {
    throw new Error('Error submitting device data: ' + error.message);
  }
};
