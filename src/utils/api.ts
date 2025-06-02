// import axios from "axios"
// // import { mockCategories, mockProducts, mockModifiers } from "./mockData"
// import env from "../config/env" 

// // Store recent API responses for debugging
// export const apiDebugStore = {
//   lastRequest: null,
//   lastResponse: null,
//   lastError: null,
//   history: [],
//   isUsingMockData: false,
// }

// // Use the API URL from our environment configuration
// const API_URL = env.NEXT_PUBLIC_API_URL 

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000, // Increased timeout to 10 seconds
// })

// // Log the API URL during initialization to verify it's correct
// console.log(`API configured with base URL: ${API_URL}`)

// export const fetchData = async (endpoint: string, data: any) => {
//   // Store the request for debugging
//   apiDebugStore.lastRequest = { endpoint, data, timestamp: new Date().toISOString() }
//   apiDebugStore.isUsingMockData = false

//   try {
//     console.log(`🔄 API Request to ${endpoint}:`, JSON.stringify(data, null, 2))

//     const response = await api.post(endpoint, data)

//     // Store the successful response for debugging
//     apiDebugStore.lastResponse = {
//       data: response.data,
//       status: response.status,
//       timestamp: new Date().toISOString(),
//     }

//     // Add to history (limit to last 10 requests)
//     apiDebugStore.history.unshift({
//       type: "success",
//       endpoint,
//       request: data,
//       response: response.data,
//       timestamp: new Date().toISOString(),
//     })
//     if (apiDebugStore.history.length > 10) apiDebugStore.history.pop()

//     console.log(`✅ API Response from ${endpoint}:`, JSON.stringify(response.data, null, 2))
//     return response.data
//   } catch (error) {
//     console.warn(`❌ API Error on ${endpoint}:`, error)

//     // Store the error for debugging
//     apiDebugStore.lastError = {
//       message: error.message,
//       code: error.code,
//       timestamp: new Date().toISOString(),
//     }

//     // Add to history
//     apiDebugStore.history.unshift({
//       type: "error",
//       endpoint,
//       request: data,
//       error: { message: error.message, code: error.code },
//       timestamp: new Date().toISOString(),
//     })
//     if (apiDebugStore.history.length > 10) apiDebugStore.history.pop()

//     // Return mock data based on endpoint
//     // apiDebugStore.isUsingMockData = true

//     // if (endpoint.includes("categories")) {
//     //   console.log("🔄 Using mock categories data")
//     //   return mockCategories
//     // } else if (endpoint.includes("products")) {
//     //   console.log("🔄 Using mock products data")
//     //   return mockProducts
//     // } else if (endpoint.includes("modifier-details")) {
//     //   console.log("🔄 Using mock modifiers data")
//     //   return mockModifiers
//     // } else if (endpoint.includes("customers")) {
//     //   // Mock customer data
//     //   return { Result: [], Status: true }
//     // } else if (endpoint.includes("device")) {
//     //   return { Status: true }
//     // }

//     // Default fallback
//     return { Status: true, Result: [] }
//   }
// }
