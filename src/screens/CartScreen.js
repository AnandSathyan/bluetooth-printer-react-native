"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
} from "react-native"
import React from "react";
  
import { useNavigation } from "@react-navigation/native"
import { useAppSelector, useAppDispatch } from "../hooks/hooks"
import { addToCart, removeFromCart, updateQuantity } from "../store/cart/cartSlice"
import ApiDebugButton from "../components/ApiDebugButton"
import { __DEV__ } from "react-native"

export default function CartScreen() {
  const { width } = useWindowDimensions()
  const isTablet = width > 768

  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side rendering equivalent in React Native
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = (item, type) => {
    const quantity = type === "add" ? 1 : -1
    const cartItem = {
      ...item,
      quantity,
    }
    dispatch(addToCart(cartItem))
  }

  const updateItemQuantity = (id, delta) => {
    const item = cartItems.find((item) => item.id === id)
    if (!item) return

    const newQuantity = Math.max(1, item.quantity + delta)
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handlePayment = () => {
    navigation.navigate("Payment")
  }

  const calculateItemTotal = (item) => {
    const basePrice = Number.parseFloat(item.Price?.toString() || "0")
    if (isNaN(basePrice)) return 0

    const crustOptionsTotal =
      item.crustOptions?.reduce((total, option) => {
        const optionPrice = Number.parseFloat(option.price)
        return isNaN(optionPrice) ? total : total + optionPrice
      }, 0) || 0

    return basePrice + crustOptionsTotal
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  if (!isClient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>Your cart is empty</Text>
        </View>
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Add some items to your cart to continue</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("FoodOrderingKiosk")}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItem, !isTablet && styles.cartItemMobile]}>
      {/* Left: Image + Info */}
      <View style={[styles.itemLeftSection, !isTablet && styles.itemLeftSectionMobile]}>
        <View style={styles.itemImageContainer}>
          <Image
            source={{ uri: item.image || "https://via.adaptive-icon.com/150" }}
            style={styles.itemImage}
            defaultSource={require("../../assets/adaptive-icon.png")}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.ItemName}
          </Text>

          {/* Crust Options */}
          {item.crustOptions?.length > 0 && (
            <View style={styles.crustOptionsContainer}>
              {item.crustOptions.map((crust) => (
                <View key={crust.id} style={styles.crustOption}>
                  <Text style={styles.crustOptionText} numberOfLines={1}>
                    {crust.name} x{crust.quantity} (+KWD {(Number.parseFloat(crust.price) * crust.quantity).toFixed(3)})
                  </Text>
                  <TouchableOpacity
                    style={styles.removeOptionButton}
                    onPress={() => dispatch(removeFromCart({ id: item.id, crustOptionId: crust.id }))}
                  >
                    <Text style={styles.removeOptionButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Right: Price, Quantity & Delete */}
      <View style={[styles.itemRightSection, !isTablet && styles.itemRightSectionMobile]}>
        {/* Price */}
        <Text style={styles.itemPrice}>KWD {item.Price}</Text>

        {/* Quantity Control */}
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => handleAddToCart(item, "minus")}
            disabled={item.quantity <= 1}
            style={[styles.quantityButton, item.quantity <= 1 && styles.disabledQuantityButton]}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity onPress={() => handleAddToCart(item, "add")} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => dispatch(removeFromCart({ id: item.id }))} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>🗑️ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>Review your selected items</Text>
      </View>

      {/* Cart List */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.cartList, !isTablet && styles.cartListMobile]}
      />

      {/* Checkout Footer */}
      <View style={[styles.checkoutFooter, !isTablet && styles.checkoutFooterMobile]}>
        <View style={[styles.totalSection, !isTablet && styles.totalSectionMobile]}>
          <View style={styles.paymentLogoContainer}>
            <Image
              source={{ uri: "https://via.adaptive-icon.com/150" }}
              style={styles.paymentLogo}
              defaultSource={require("../../assets/adaptive-icon.png")}
            />
          </View>
          <View style={styles.totalTextContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>KWD {totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.paymentButton, !isTablet && styles.paymentButtonMobile]}
          onPress={handlePayment}
        >
          <Text style={styles.paymentButtonText}>Proceed to payment</Text>
        </TouchableOpacity>
      </View>
      {__DEV__ && <ApiDebugButton />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyCartText: {
    color: "#666",
    marginBottom: 16,
    fontSize: 16,
  },
  browseButton: {
    backgroundColor: "black",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartList: {
    padding: 16,
    paddingBottom: 100, // Space for the checkout footer
  },
  cartListMobile: {
    padding: 8,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    marginBottom: 12,
  },
  cartItemMobile: {
    flexDirection: "column",
    padding: 10,
  },
  itemLeftSection: {
    flexDirection: "row",
    flex: 1,
  },
  itemLeftSectionMobile: {
    marginBottom: 10,
  },
  itemImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  crustOptionsContainer: {
    marginTop: 4,
  },
  crustOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  crustOptionText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  removeOptionButton: {
    marginLeft: 8,
    padding: 2,
  },
  removeOptionButtonText: {
    color: "#e53e3e",
    fontSize: 14,
  },
  itemRightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 16,
  },
  itemRightSectionMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 0,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0e7490",
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledQuantityButton: {
    backgroundColor: "#e2e8f0",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    fontSize: 12,
    color: "#e53e3e",
    fontWeight: "500",
  },
  checkoutFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutFooterMobile: {
    flexDirection: "column",
    paddingVertical: 12,
  },
  totalSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalSectionMobile: {
    width: "100%",
    marginBottom: 12,
  },
  paymentLogoContainer: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  paymentLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  totalTextContainer: {
    flexDirection: "column",
  },
  totalLabel: {
    fontSize: 12,
    color: "#888",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paymentButton: {
    backgroundColor: "black",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
  },
  paymentButtonMobile: {
    width: "100%",
    alignItems: "center",
  },
  paymentButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
