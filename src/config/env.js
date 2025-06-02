// Environment configuration for React Native
import { Platform } from "react-native"
// import { __DEV__ } from "react-native/config"

// Define the shape of our environment variables
// interface Env {
//   PUBLIC_API_URL_ADMIN_PANEL: any
//   NEXT_PUBLIC_API_URL: any
//   API_URL_ADMIN_PANEL: string
//   IS_DEV: boolean
//   APP_VERSION: string
//   PLATFORM: string
// }

// Default values (used as fallbacks)
const defaultEnv = {
  NEXT_PUBLIC_API_URL: "http://74.208.235.72:1001",
  PUBLIC_API_URL_ADMIN_PANEL: "http://74.208.235.72:8089",
   // Fallback URL
  // IS_DEV: __DEV__, // React Native's built-in development flag
  APP_VERSION: "1.0.0",
  PLATFORM: Platform.OS,
}

// Try to get environment variables from various sources
const getEnv = () => {
  try {
    // For Expo, you could use Constants.expoConfig?.extra here

    // For react-native-dotenv, variables would be imported directly

    // For now, we'll use the environment variable you added to Vercel
    // Note: This needs to be properly injected into your app build
    const apiUrl = env.NEXT_PUBLIC_API_URL || defaultEnv.API_URL_ADMIN_PANEL

    console.log("Environment loaded, API URL:", apiUrl)

    return {
      ...defaultEnv,
      API_URL_ADMIN_PANEL: apiUrl,
    }
  } catch (error) {
    console.warn("Failed to load environment variables:", error)
    return defaultEnv
  }
}

// Export the environment configuration
const env = getEnv()
export default env
