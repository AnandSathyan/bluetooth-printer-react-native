// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store from "./src/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

// Screens
// import Home from "./src/app/page";
import FoodOrderingKiosk from "./src/screens/FoodOrderingKiosk";
import CartScreen from "./src/screens/CartScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import LoginRegisterScreen from "./src/screens/LoginScreen";
import HomePage from "./src/screens/HomeScreen";
import SamplePrintScreen from "./SamplePrint";
import PaymentFailed from "./src/app/Payment/Failed/page";
import OrderCompleted from "./src/app/Payment/complete/page";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="LicenseCheck" component={Home} /> */}
            <Stack.Screen name="FoodOrderingKiosk" component={FoodOrderingKiosk} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="Login" component={LoginRegisterScreen} />
            <Stack.Screen name="PrinterSettings" component={PaymentScreen} />
            <Stack.Screen name="Payment" component={SamplePrintScreen} />
            <Stack.Screen name="/Payment/Failed" component={PaymentFailed} />
            <Stack.Screen name="/Payment/complete" component={OrderCompleted} />


          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
