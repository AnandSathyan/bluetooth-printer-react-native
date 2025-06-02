'use client';
import { clearUserData, getUser } from '../../store/customer/getCustomerSlice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getCustomerByMobile } from 'your/api'; // replace with your real API
import { addUser } from '../../store/customer/addCustomerSlice';

const CustomerModal = ({ onClose }: any) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const getUserDetails = useSelector((state: any) => state.getUserDetails);

  const [mobileInput, setMobileInput] = useState('');
  const [customerFound, setCustomerFound] = useState(false);
  const prepareCustomerPayload = (data: any) => ({
    "RegistrationNo": "3118",
    "companyid": "1",
    "brandid": "1",
    "countryid": "1",
    "CustomerCode": "",
    "LocalName": data.CustomerName,
    "CustomerName": data.CustomerName,
    "DOB": "2001-12-25",
    "Telephone": data.mobileno,
    "CreditLimit": "1000",
    "Emailid": data.Emailid,
    "Address": data.Address,
    "ContactPerson": data.CustomerName,
    "civilid": "CIV1111",
    "mobileno": data.mobileno,
    "website": "anand.com",
    "area": "Area",
    "block": "Block",
    "street": "Street",
    "EditedByID": "",
    "EditedDate": "",
    "CreatedByID": "7",
    "CreatedDate": "2024-12-26 17:13:59",
    "ActiveStatus": "1",
    "mobileno2": data.mobileno,
    "IsSync": "0",
    "CustomerGroupID": "4",
    "GSTNO": "123456789",
    "StateID": "47"
  });

  const [formData, setFormData] = useState({
    RegistrationNo: '',
    CustomerName: '',
    mobileno: '',
    Address: '',
    Emailid: '',
    // DOB: ''
  });

  const handleMobileCheck = async () => {
    const userDataToSend = {
      RegistrationNo: "3118",
      mobileno: mobileInput,
    };

    try {
      const response: any = await dispatch(getUser(userDataToSend) as any);
      const data = response?.payload;
      const results = data?.Result || [];

      // Find a customer whose mobile number matches exactly
      const matchedCustomer = results.find(
        (customer: any) => customer.mobileno === mobileInput
      );

      if (matchedCustomer) {
        setFormData({
          RegistrationNo: matchedCustomer.RegistrationNo || '',
          CustomerName: matchedCustomer.CustomerName || '',
          mobileno: matchedCustomer.mobileno || '',
          Address: matchedCustomer.Address || '',
          Emailid: matchedCustomer.Emailid || '',
        });
      } else {
        // No match found, assume new customer
        setFormData({
          RegistrationNo: "",
          CustomerName: '',
          mobileno: mobileInput,
          Address: '',
          Emailid: '',
        });
      }

      setCustomerFound(true);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };



  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const isExistingCustomer = getUserDetails?.Result?.[0]?.mobileno === formData.mobileno;

    if (!isExistingCustomer) {
      const payload = prepareCustomerPayload(formData);

      try {
        const response = await dispatch(addUser(payload) as any);
        if (response?.payload?.Status) {
          console.log("Customer added successfully");
        } else {
          console.error("Failed to add customer",response);
        }
      } catch (err) {
        console.error("Error adding customer:", err);
      }
    }

    onClose();
    router.push("/Cart");
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Customer Info</h2>

        {!customerFound ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleMobileCheck}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Check Mobile
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <input
                name="CustomerName"
                placeholder="Customer Name"
                value={formData.CustomerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                name="mobileno"
                placeholder="Mobile Number"
                value={formData.mobileno}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                name="Address"
                placeholder="Address"
                value={formData.Address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                name="Emailid"
                placeholder="Email"
                value={formData.Emailid}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerModal;
