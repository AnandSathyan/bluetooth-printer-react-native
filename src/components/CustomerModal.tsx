"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import React from "react";

import { useDispatch, useSelector } from "react-redux"
import { getUser } from "../store/customer/getCustomerSlice"
import { addUser } from "../store/customer/addCustomerSlice"

const CustomerModal = ({ onClose, navigation }) => {
  const { width } = useWindowDimensions()
  const isTablet = width > 768

  const dispatch = useDispatch()
  const getUserDetails = useSelector((state) => state.getUserDetails)

  const [mobileInput, setMobileInput] = useState("")
  const [customerFound, setCustomerFound] = useState(false)

  const [formData, setFormData] = useState({
    RegistrationNo: "",
    CustomerName: "",
    mobileno: "",
    Address: "",
    Emailid: "",
  })

  const prepareCustomerPayload = (data) => ({
    RegistrationNo: "3118",
    companyid: "1",
    brandid: "1",
    countryid: "1",
    CustomerCode: "",
    LocalName: data.CustomerName,
    CustomerName: data.CustomerName,
    DOB: "2001-12-25",
    Telephone: data.mobileno,
    CreditLimit: "1000",
    Emailid: data.Emailid,
    Address: data.Address,
    ContactPerson: data.CustomerName,
    civilid: "CIV1111",
    mobileno: data.mobileno,
    website: "anand.com",
    area: "Area",
    block: "Block",
    street: "Street",
    EditedByID: "",
    EditedDate: "",
    CreatedByID: "7",
    CreatedDate: "2024-12-26 17:13:59",
    ActiveStatus: "1",
    mobileno2: data.mobileno,
    IsSync: "0",
    CustomerGroupID: "4",
    GSTNO: "123456789",
    StateID: "47",
  })

  const handleMobileCheck = async () => {
    const userDataToSend = {
      RegistrationNo: "3118",
      mobileno: mobileInput,
    }

    try {
      const response = await dispatch(getUser(userDataToSend))
      const data = response?.payload
      const results = data?.Result || []

      // Find a customer whose mobile number matches exactly
      const matchedCustomer = results.find((customer) => customer.mobileno === mobileInput)

      if (matchedCustomer) {
        setFormData({
          RegistrationNo: matchedCustomer.RegistrationNo || "",
          CustomerName: matchedCustomer.CustomerName || "",
          mobileno: matchedCustomer.mobileno || "",
          Address: matchedCustomer.Address || "",
          Emailid: matchedCustomer.Emailid || "",
        })
      } else {
        // No match found, assume new customer
        setFormData({
          RegistrationNo: "",
          CustomerName: "",
          mobileno: mobileInput,
          Address: "",
          Emailid: "",
        })
      }

      setCustomerFound(true)
    } catch (err) {
      console.error("Error fetching user:", err)
      // Fallback for demo/testing
      setFormData({
        RegistrationNo: "",
        CustomerName: "",
        mobileno: mobileInput,
        Address: "",
        Emailid: "",
      })
      setCustomerFound(true)
    }
  }

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    const isExistingCustomer = getUserDetails?.Result?.[0]?.mobileno === formData.mobileno

    if (!isExistingCustomer) {
      const payload = prepareCustomerPayload(formData)

      try {
        const response = await dispatch(addUser(payload))
        if (response?.payload?.Status) {
          console.log("Customer added successfully")
        } else {
          console.error("Failed to add customer", response)
        }
      } catch (err) {
        console.error("Error adding customer:", err)
      }
    }

    onClose()
    navigation.navigate("Cart")
  }

  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <View style={[styles.container, !isTablet && styles.containerMobile]}>
          <Text style={styles.title}>Customer Info</Text>

          {!customerFound ? (
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                value={mobileInput}
                onChangeText={setMobileInput}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleMobileCheck}>
                <Text style={styles.buttonText}>Check Mobile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView>
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Customer Name"
                  value={formData.CustomerName}
                  onChangeText={(value) => handleChange("CustomerName", value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  value={formData.mobileno}
                  onChangeText={(value) => handleChange("mobileno", value)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={formData.Address}
                  onChangeText={(value) => handleChange("Address", value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.Emailid}
                  onChangeText={(value) => handleChange("Emailid", value)}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  containerMobile: {
    width: "90%",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default CustomerModal
