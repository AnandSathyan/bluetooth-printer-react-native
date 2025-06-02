"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
} from "react-native"
import React from "react";

import { useNavigation } from "@react-navigation/native"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { fetchCategories } from "../store/category/categoryThunk"
import { submitProduct } from "../store/product/productThunk"
import { addToCart, removeFromCart } from "../store/cart/cartSlice"
import { submitDevice } from "../store/device/deviceThunk"
import { fetchmodifierCategoryVal } from "../store/modifier/modifierCategoryThunk"
import { fetchmodifierDetailsVal } from "../store/modifier/modifierThunk"
import CustomerModal from "../components/CustomerModal"
import ApiDebugButton from "../components/ApiDebugButton"
import { __DEV__ } from "react-native"
import env from "../config/env"

export default function FoodOrderingKiosk() {
  const { width, height } = useWindowDimensions()
  const isTablet = width > 768

  const [showModal, setShowModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Menu")
  const [activeIndex, setActiveIndex] = useState(null)
  const cartItems = useAppSelector((state) => state.cart.items)
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const { categories } = useAppSelector((state) => state.category)
  const productData = useAppSelector((state) => state.product)
  const modifierCategory = useAppSelector((state) => state.modifierCategory)
  const modifierDetails = useAppSelector((state) => state.modifierDescription)

  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const modalRef = useRef(null)
console.log("productData",productData);

  const [selections, setSelections] = useState({
    quantity: 1,
    crust: [],
    pizza: "",
    drink: "",
    item: selectedProduct,
  })

  // adaptive-icon images
  const Noimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3CETL_OertJKScoHfblxs6CBrKGVCmVESw&s"
  const Allimage =
    "data:image/jpeg;base64,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"
  const baseURL = `${env.PUBLIC_API_URL_ADMIN_PANEL}`
  const basePrice = selectedProduct?.Price || 0
  const itemQuantity = selectedProduct?.quantity || 0

  const crustOptions = useMemo(
    () =>
      (modifierDetails?.modifierDetails?.Result || [])
        .filter((mod) => mod?.ItemID == selectedProduct?.id)
        .map((mod) => ({
          id: mod.ID.toString(),
          name: mod.ModifierName,
          price: Number.parseFloat(mod.Price),
          modifierId: mod.ModifierID,
        })),
    [modifierDetails, selectedProduct],
  )

  const handleCrustToggle = (optId, product) => {

    const selected = selections.crust.includes(optId)
    const crust = crustOptions.find((opt) => opt.id === optId)

    if (!crust) return

    if (selected) {
      dispatch(removeFromCart({ id: product.id, crustOptionId: optId }))
    } else {
      dispatch(
        addToCart({
          ...product,
          quantity: 0, // don't change base quantity
          crustOptions: [{ ...crust, quantity: 1 }],
        }),
      )
    }

    // Toggle local UI state for checkbox
    setSelections((prev) => ({
      ...prev,
      crust: selected ? prev.crust.filter((id) => id !== optId) : [...prev.crust, optId],
    }))
  }

  const calculateTotal = useMemo(() => {
    const extrasTotal = selections?.crust?.reduce((sum, id) => {
      const option = crustOptions.find((opt) => opt.id === id)
      return option ? sum + option.price : sum
    }, 0)

    return basePrice * itemQuantity + extrasTotal
  }, [basePrice, itemQuantity, selections.crust, crustOptions])

  useEffect(() => {
    const fetchData = async () => {
      if (productData.products?.length === 0) {
        await dispatch(submitProduct())
      }

      const requestData = {
        Param: "Select",
        MenuCategories: {
          RegistrationNo: "3118",
          CompanyID: "1",
          BrandID: "1",
          BranchID: "1",
          ID: "0",
          MenuName: "",
          POS_ITEM_CAT_ID: "",
          POS_ITEM_CAT_PARENT: "",
          POS_ITEM_CAT_NAME: "",
          E_BUTTON_NAME: "",
          B_BUTTON_NAME: "",
          BTN_BACK_COLOR: "",
          BTN_FORE_COLOR: "",
          KITCHEN_PRINTER: "",
          KITCHEN_DISPLAY: "",
          ItemLogo: "",
          CreatedByID: "",
          CreatedDate: "",
          EditedByID: "",
          EditedDate: "",
          ActiveStatus: "",
        },
      }

      await dispatch(fetchCategories([requestData]))
    }

    fetchData()
  }, [dispatch, productData.products?.length])

  useEffect(() => {
    dispatch(submitDevice())
  }, [dispatch])

  useEffect(() => {
    if (selectedProduct) {
      const modifierData = [
        {
          Param: "Select",
          ModifierDetail: {
            RegistrationNo: "3118",
            ModifierID: "0",
            ModifierName: "0",
            ItemID: "0",
            ID: "0",
            IsSync: "True",
            Type: "0",
            Display_Price: "True",
            Price: "0",
            CreatedByID: "0",
            CreatedDate: "2024-06-20",
            EditedByID: "0",
            EditedDate: "2024-06-20",
          },
        },
      ]
      const modifierCategoryData = [
        {
          Param: "Select",
          ModifierCategory: {
            RegistrationNo: "3118",
            CompanyID: "1",
            BrandID: "1",
            ModifierCategoryID: "0",
            ModifierCategoryName: "0",
            ModifierCategoryName_L: "0",
            Item_Name_L: "0",
            ActiveStatus: "True",
            Type_Selection: "0",
            CreatedByID: "0",
            CreatedDate: "2024-08-23",
            EditedByID: "0",
            EditedDate: "2024-08-23",
            IsSync: "False",
          },
        },
      ]
      dispatch(fetchmodifierCategoryVal(modifierCategoryData))
      dispatch(fetchmodifierDetailsVal(modifierData))
    }
  }, [selectedProduct])

  const handleAddToCart = (item, type) => {
    const quantityChange = type === "add" ? 1 : -1
    const cartItem = {
      ...item,
      quantity: quantityChange,
    }
    dispatch(addToCart(cartItem))
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

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + (increment ? 1 : -1)))
  }

  const handleCancel = () => {
    dispatch({ type: "cart/clearCart" })
  }

  const handleCart = () => {
    setShowModal(false)
    setShowCustomerModal(true)
  }

  const menuItems = useMemo(() => {
    if (!productData.products?.length) return []
    const uniqueItems = new Map()
    productData?.products?.forEach((prod) => {
      prod?.Result?.forEach((item) => {
        const uniqueId = item.ItemID?.toString()
        console.log("uniqueId",uniqueId);
        
        if (!uniqueItems.has(uniqueId)) {
          uniqueItems.set(uniqueId, {
            id: uniqueId,
            ItemName: item.ItemName || "",
            Price: Number.parseFloat(item.Price) || 0,
            quantity: 1,
            image: `${baseURL}${item.ItemImage}` || item.ItemImage, // Empty image as requested
            category: item.ItemCategoryID || "Uncategorized",
            ItemDesc: item.ItemDesc || "",
            isRecommended: item.isRecommended || false,
            discount: item.discount || 0,
          })
        }
      })
    })
    return Array.from(uniqueItems.values())
  }, [productData?.products, baseURL])

  const categoryList = useMemo(() => {
    if (!categories?.Result) return []
    return [
      { name: "All Menu", icon: Allimage, id: "0", itemCount: menuItems.length },
      ...(categories.Result.map((category) => ({
        name: category.E_BUTTON_NAME,
        icon: category.ItemLogo ? `${baseURL}${category.ItemLogo}` : Noimage, // Empty image as requested
        itemCount: menuItems.filter((item) => item.category === category.ID).length,
        id: category.ID,
      })) || []),
    ]
  }, [categories, menuItems, baseURL, Allimage, Noimage])

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Menu") return menuItems
    const matchedCategory = categoryList.find((cat) => cat.name === activeCategory)
    if (!matchedCategory) return []
    return menuItems.filter((item) => item.category === matchedCategory.id)
  }, [activeCategory, menuItems, categoryList])

  // Get cart quantity for a product
  const getCartQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const renderCategoryItem = ({ item, index }) => {
    const isActive = item.name === activeCategory
    return (
      <TouchableOpacity
        onPress={() => setActiveCategory(item.name)}
        style={[
          styles.categoryButton,
          isActive && styles.activeCategoryButton,
          !isTablet && styles.categoryButtonMobile,
        ]}
      >
        <View style={styles.categoryImageContainer}>
          <Image
            source={{ uri: item.icon || "https://via.adaptive-icon.com/150" }}
            style={styles.categoryImage}
            defaultSource={require("../../assets/adaptive-icon.png")}
          />
        </View>
        <Text
          style={[styles.categoryText, isActive && styles.activeCategoryText, !isTablet && styles.categoryTextMobile]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderProductItem = ({ item }) => {
    const cartQuantity = getCartQuantity(item.id)
    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          activeIndex === item?.id && styles.activeProductCard,
          !isTablet && styles.productCardMobile,
        ]}
        onPress={() => {
          setShowModal(true)
          setSelectedProduct(item)
        }}
      >
        {cartQuantity > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>{cartQuantity}</Text>
          </View>
        )}
        <Image
          source={{ uri: item.image || "https://via.adaptive-icon.com/150" }}
          style={styles.productImage}
          defaultSource={require("../../assets/adaptive-icon.png")}
        />
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.ItemName}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.ItemDesc}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>KWD {item.Price.toFixed(3)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation()
              handleAddToCart(item, "add")
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  // Determine layout based on screen size
  const layout = isTablet ? (
    <View style={styles.container}>
      {/* Categories Sidebar */}
      <View style={styles.sidebar}>
        <FlatList
          data={categoryList}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fire Fresh</Text>
            <Text style={styles.headerSubtitle}>Fresh & Healthy Food</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>
              <Text style={styles.statsHighlight}>{filteredProducts?.length}</Text> Items
            </Text>
            <Text style={styles.statsText}>
              <Text style={styles.statsHighlight}>{categoryList.length - 1}</Text> Categories
            </Text>
          </View>
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products Found...!</Text>
            </View>
          }
        />
      </View>
    </View>
  ) : (
    <SafeAreaView style={styles.containerMobile}>
      {/* Header */}
      <View style={styles.headerMobile}>
        <Text style={styles.headerTitle}>Fire Fresh</Text>
        <Text style={styles.headerSubtitle}>Fresh & Healthy Food</Text>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainerMobile}>
        <FlatList
          horizontal
          data={categoryList}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesListMobile}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsGridMobile}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products Found...!</Text>
          </View>
        }
      />
    </SafeAreaView>
  )

  return (
    <>
      {layout}

      {/* Cart Footer - Common for both layouts */}
      {cartItems.length > 0 && (
        <View style={[styles.cartFooter, !isTablet && styles.cartFooterMobile]}>
          <View style={styles.cartTotalContainer}>
            <Image
              source={{ uri: "https://via.adaptive-icon.com/60x28" }}
              style={styles.cartIcon}
              defaultSource={require("../../assets/adaptive-icon.png")}
            />
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>KWD {subtotal.toFixed(3)}</Text>
          </View>
          <View style={styles.cartActions}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCart}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Product Detail Modal */}
      <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, !isTablet && styles.modalContentMobile]} ref={modalRef}>
            {/* Grabber */}
            <View style={styles.modalGrabber} />

            {/* Product Info */}
            <View style={styles.modalProductInfo}>
              <Image
                source={{ uri: selectedProduct?.image || "https://via.adaptive-icon.com/150" }}
                style={styles.modalProductImage}
                defaultSource={require("../../assets/adaptive-icon.png")}
              />
              <Text style={styles.modalProductTitle}>{selectedProduct?.ItemName}</Text>
              <Text style={styles.modalProductPrice}>KWD {basePrice?.toFixed(3)}</Text>

              {/* Quantity Selector */}
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[styles.quantityButton, getCartQuantity(selectedProduct?.id) <= 0 && styles.disabledButton]}
                  onPress={() => handleAddToCart(selectedProduct, "minus")}
                  disabled={getCartQuantity(selectedProduct?.id) <= 0}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>
                  {getCartQuantity(selectedProduct?.id) > 0 ? getCartQuantity(selectedProduct?.id) : "0"}
                </Text>

                <TouchableOpacity style={styles.quantityButton} onPress={() => handleAddToCart(selectedProduct, "add")}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isInvalid && <Text style={styles.errorText}>Quantity cannot be less than 0</Text>}

            {/* Extras / Crusts */}
            {crustOptions.length > 0 && (
              <View style={styles.extrasContainer}>
                <Text style={styles.extrasTitle}>Extras</Text>
                <ScrollView style={styles.extrasList}>
                  {crustOptions.map((opt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.extraItem}
                      onPress={() => handleCrustToggle(opt.id, selectedProduct)}
                    >
                      <Text style={styles.extraName}>{opt.name}</Text>
                      <Text style={styles.extraPrice}>{opt.price.toFixed(3)} KWD</Text>
                      <View style={styles.checkbox}>
                        {selections && selections?.crust && selections?.crust.includes(opt.id) && <View style={styles.checkboxInner} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Action Buttons */}
            <View style={[styles.modalActions, !isTablet && styles.modalActionsMobile]}>
              <TouchableOpacity
                style={[styles.backButton, !isTablet && styles.backButtonMobile]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addToCartButton, !isTablet && styles.addToCartButtonMobile]}
                onPress={() => handleCart()}
              >
                <Text style={styles.addToCartButtonText}>
                  {isTablet
                    ? `Add to cart – KWD ${calculateTotal.toFixed(3)}`
                    : `Add`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Customer Modal */}
      {showCustomerModal && <CustomerModal onClose={() => setShowCustomerModal(false)} navigation={navigation} />}

      {/* Debug Button */}
      {__DEV__ && <ApiDebugButton />}
    </>
  )
}
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  // ========== Layout ==========
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  containerMobile: {
    flex: 1,
    backgroundColor: "white",
  },
  sidebar: {
    width: 120,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  mainContent: {
    flex: 1,
  },

  // ========== Header ==========
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerMobile: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  headerStats: {
    alignItems: "flex-end",
  },
  statsText: {
    fontSize: 14,
    color: "#888",
  },
  statsHighlight: {
    color: "#ff6b00",
    fontWeight: "bold",
  },

  // ========== Category ==========
  categoriesContainerMobile: {
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoriesListMobile: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  categoryButton: {
    width: 120,
    height: 180,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategoryButton: {
    borderWidth: 2,
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },
  categoryButtonMobile: {
    width: 80,
    height: 90,
    marginHorizontal: 4,
  },
  categoryImageContainer: {
    width: 64,
    height: 40,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
  },
  activeCategoryText: {
    color: "#22c55e",
    fontWeight: "600",
  },
  categoryTextMobile: {
    fontSize: 10,
  },

  // ========== Products ==========
  productsGrid: {
    padding: 16,
    paddingBottom: 100,
    objectFit:"fill",
  },
  productsGridMobile: {
    padding: 8,
    paddingBottom: 100,
  },
  productCard: {
    width: (width - 160) / 2,
    marginBottom: 16,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productCardMobile: {
    flex: 1,
    margin: 4,
    maxWidth: "48%",
  },
  activeProductCard: {
    borderColor: "#22333b",
    shadowOpacity: 0.1,
    backgroundColor: "#faf5ff",
  },
  productImage: {
    width: 140,      
    height: 80,    
    borderRadius: 8, 
    // backgroundColor:"blue",
    alignSelf: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
  productDescription: {
    fontSize: 12,
    textAlign: "center",
    color: "#888",
    marginTop: 4,
    minHeight: 32,
  },
  productFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // ========== Cart ==========
  cartFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
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
  cartFooterMobile: {
    flexDirection: "column",
    paddingVertical: 10,
    height: "auto",
  },
  cartTotalContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  totalLabel: {
    fontSize: 16,
    marginRight: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#415a77",
  },
  cartActions: {
    flexDirection: "row",
  },

  // ========== Buttons ==========
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 16,
    backgroundColor: "#22333b",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    position: "absolute",
    right: -30,
    bottom: -10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#22333b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#e53e3e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ========== Quantity ==========
  quantityBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22333b",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  quantityBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#22333b",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
  },

  // ========== Modal ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalContentMobile: {
    maxHeight: "80%",
  },
  modalGrabber: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalProductInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  modalProductImage: {
    width: 160,
    height: 100,
    resizeMode: "contain",
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalProductTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  modalProductPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22333b",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  modalActionsMobile: {
    marginTop: 16,
  },

  // ========== Extras ==========
  extrasContainer: {
    marginTop: 24,
  },
  extrasTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  extrasList: {
    maxHeight: 200,
  },
  extraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#eee",
    borderRadius: 16,
    marginBottom: 8,
  },
  extraName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  extraPrice: {
    fontSize: 14,
    color: "#888",
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#22333b",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22333b",
  },

  // ========== Common ==========
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "#e53e3e",
    marginTop: 8,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#22333b",
    borderRadius: 16,
  },
  backButtonText: {
    color: "#22333b",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  addToCartButton: {
    backgroundColor: "#22333b",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButtonMobile: {
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
  },
  addToCartButtonMobile: {
    paddingVertical: 12,
    flex: 2,
  },
});

// export default styles;




{/* <View style={styles.cartContainer}>
  <Text style={styles.cartHeader}>My Cart</Text>

  {cartItems.map((item, index) => (
    <View key={item.id || index} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          Colour: {item.color} | Item #{item.code}
        </Text>
        <Text style={styles.itemPrice}>KWD {item.price.toFixed(3)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  ))}

  <TouchableOpacity style={styles.checkoutBtn} onPress={handleCart}>
    <Text style={styles.checkoutBtnText}>Checkout</Text>
  </TouchableOpacity>
</View> */}


// cartContainer: {
//   backgroundColor: "#fff",
//   borderTopLeftRadius: 24,
//   borderTopRightRadius: 24,
//   padding: 20,
//   paddingBottom: 40,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: -2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 6,
//   elevation: 5,
// },

// cartHeader: {
//   fontSize: 18,
//   fontWeight: "600",
//   marginBottom: 20,
//   color: "#111827",
// },

// cartItem: {
//   flexDirection: "row",
//   alignItems: "center",
//   borderBottomWidth: 1,
//   borderBottomColor: "#e5e7eb",
//   paddingVertical: 16,
// },

// itemImage: {
//   width: 60,
//   height: 60,
//   borderRadius: 8,
//   marginRight: 12,
//   resizeMode: "contain",
// },

// itemDetails: {
//   flex: 1,
// },

// itemTitle: {
//   fontSize: 16,
//   fontWeight: "600",
//   color: "#1f2937",
// },

// itemMeta: {
//   fontSize: 14,
//   color: "#6b7280",
//   marginVertical: 4,
// },

// itemPrice: {
//   fontSize: 16,
//   fontWeight: "bold",
//   color: "#111827",
// },

// removeButton: {
//   paddingHorizontal: 8,
//   paddingVertical: 4,
// },

// removeText: {
//   fontSize: 14,
//   color: "#9ca3af",
//   textDecorationLine: "underline",
// },

// checkoutBtn: {
//   marginTop: 24,
//   backgroundColor: "#111827",
//   paddingVertical: 14,
//   borderRadius: 999,
//   alignItems: "center",
// },

// checkoutBtnText: {
//   color: "#fff",
//   fontSize: 16,
//   fontWeight: "600",
// },
