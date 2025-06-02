"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import type { RootState } from "../../store"
import { fetchCategories } from "../../store/category/categoryThunk"
import { submitProduct } from "../../store/product/productThunk"
import { addToCart, removeFromCart, updateQuantity } from "../../store/cart/cartSlice"
import CustomerModal from "../Customer/page"
import { submitDevice } from "../../store/device/deviceThunk"
import { fetchmodifierCategoryVal } from "../../store/modifier/modifierCategoryThunk"
import { fetchmodifierDetailsVal } from "../../store/modifier/modifierThunk"

export default function FoodOrderingKiosk() {
  const [showModal, setShowModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Menu")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const cartItems = useAppSelector((state) => state.cart.items)
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isInvalid,setisInvalid] = useState(false)
  const { categories } = useAppSelector((state: any) => state.category)
  const productData = useAppSelector((state: RootState) => state.product)
  const modifierCategory = useAppSelector((state: RootState) => state.modifierCategory)
  const modifierDetails = useAppSelector((state: RootState) => state.modifierDescription)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [selections, setSelections] = useState({
    quantity: 1,
    crust: [],
    pizza: '',
    drink: '',
    item: selectedProduct,
  })
  const Noimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3CETL_OertJKScoHfblxs6CBrKGVCmVESw&s"
  const Allimage =
    "data:image/jpeg;base64,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"
  const baseURL = `${process.env.NEXT_PUBLIC_API_URL_ADMIN_PANEL}`
  const basePrice = selectedProduct?.Price || 0
  const itemQuantity = selectedProduct?.quantity || 0
  console.log("itemQuantity",itemQuantity,selectedProduct);
  
  const crustOptions = useMemo(() => (
    modifierDetails?.modifierDetails?.Result || []
  ).filter((mod: any) => mod?.ItemID == selectedProduct?.id).map((mod: any) => ({
    id: mod.ID.toString(),
    name: mod.ModifierName,
    price: parseFloat(mod.Price),
    modifierId: mod.ModifierID,
  })), [modifierDetails, selectedProduct])

  const handleCrustToggle = (optId: string, product: any) => {
    const selected = selections.crust.includes(optId);
    const crust = crustOptions.find(opt => opt.id === optId);
  
    if (!crust) return;
  
    if (selected) {
      dispatch(removeFromCart({ id: product.id, crustOptionId: optId }));
    } else {
      dispatch(addToCart({
        ...product,
        quantity: 0, // don't change base quantity
        crustOptions: [{ ...crust, quantity: 1 }]
      }));
    }
  
    // Toggle local UI state for checkbox
    setSelections(prev => ({
      ...prev,
      crust: selected
        ? prev.crust.filter(id => id !== optId)
        : [...prev.crust, optId]
    }));
  };
  
//   useEffect(() => {
//   if (cartItems && cartItems.crustOptions) {
//     const crustIds = cartItems.crustOptions.map((opt: any) => opt?.id);
//     setSelections(prev => ({ ...prev, crust: crustIds }));
//   } else {
//     setSelections(prev => ({ ...prev, crust: [] }));
//   }
// }, [cartItems, selectedProduct?.id]);

  const calculateTotal = useMemo(() => {
    const extrasTotal = selections?.crust?.reduce((sum, id) => {
      const option = crustOptions.find((opt:any) => opt.id === id)
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
    const handleClickOutside = (event: MouseEvent) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showModal])
  const handleAddToCart = (item: any, type: any) => {
    const quantity = type === "add" ?  1 : -1;
    const quantities = getCartQuantity(item.id);
    console.log("quantities",quantities);
    
  // const isInvalid = quantity < 0;
  // setisInvalid(isInvalid)

    const cartItem = {
      ...item,
      quantity,
    };
  
    dispatch(addToCart(cartItem));
  };
  
    useEffect(() => {
    if (selectedProduct) {
      const modifierData = [{
        "Param": "Select",
        "ModifierDetail": {
          "RegistrationNo": "3118",
          "ModifierID": "0",
          "ModifierName": "0",
          "ItemID": "0",
          "ID": "0",
          "IsSync": "True",
          "Type": "0",
          "Display_Price": "True",
          "Price": "0",
          "CreatedByID": "0",
          "CreatedDate": "2024-06-20",
          "EditedByID": "0",
          "EditedDate": "2024-06-20"
        }
      }];
      const modifierCategoryData = [{
        "Param": "Select",
        "ModifierCategory": {
          "RegistrationNo": "3118",
          "CompanyID": "1",
          "BrandID": "1",
          "ModifierCategoryID": "0",
          "ModifierCategoryName": "0",
          "ModifierCategoryName_L": "0",
          "Item_Name_L": "0",
          "ActiveStatus": "True",
          "Type_Selection": "0",
          "CreatedByID": "0",
          "CreatedDate": "2024-08-23",
          "EditedByID": "0",
          "EditedDate": "2024-08-23",
          "IsSync": "False"
        }
      }]
      dispatch(fetchmodifierCategoryVal(modifierCategoryData));
      dispatch(fetchmodifierDetailsVal(modifierData));
    }
  }, [selectedProduct]);

  const calculateItemTotal = (item: any) => {
    const basePrice = parseFloat(item.Price?.toString() || '0'); // already includes quantity
    if (isNaN(basePrice)) return 0;
  
    const crustOptionsTotal = item.crustOptions?.reduce((total: number, option: any) => {
      const optionPrice = parseFloat(option.price);
      return isNaN(optionPrice) ? total : total + optionPrice; // just add once per option
    }, 0) || 0;
  
    return basePrice + crustOptionsTotal;
  };
  
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + calculateItemTotal(item),
    0
  );

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => Math.max(1, prev + (increment ? 1 : -1)))
  }

  const handleCancel = () => {
    dispatch({ type: "cart/clearCart" })
  }

  const handleCart = () => {
    setShowModal(false)
    setShowCustomerModal(true)
    // router.push("/Cart")
  }

  const menuItems = useMemo(() => {
    if (!productData.products) return []
    const uniqueItems = new Map<string, any>()
    productData.products.forEach((prod: any) => {
      prod.Result.forEach((item: any) => {
        const uniqueId = item.ItemID?.toString()
        if (!uniqueItems.has(uniqueId)) {
          uniqueItems.set(uniqueId, {
            id: uniqueId,
            ItemName: item.ItemName || "",
            Price: Number.parseFloat(item.Price) || 0,
            quantity: 1,
            image: `${baseURL}${item.ItemImage}` || item.ItemImage,
            category: item.ItemCategoryID || "Uncategorized",
            ItemDesc: item.ItemDesc || "",
            isRecommended: item.isRecommended || false,
            discount: item.discount || 0,
          })
        }
      })
    })
    return Array.from(uniqueItems.values())
  }, [productData.products, baseURL])

  const categoryList = useMemo(() => {
    if (!categories?.Result) return []
    return [
      { name: "All Menu", icon: Allimage, id: "0", itemCount: menuItems.length },
      ...(categories.Result.map((category: any) => ({
        name: category.E_BUTTON_NAME,
        icon: category.ItemLogo ? `${baseURL}${category.ItemLogo}` : Noimage,
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
  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item: any) => item.id === productId);
    return item ? item.quantity : 0;
  };
  


  
  return (
    <div className="h-[calc(100vh-70px)] w-screen grid grid-cols-[250px_1fr] bg-white font-sans overflow-hidden">
      <aside className="p-2 flex flex-col items-center space-y-4 overflow-y-auto">
        {categoryList.map((item, index) => {
          const isActive = item.name === activeCategory
          return (
            <button
              key={`${item.name}-${index}`}
              onClick={() => setActiveCategory(item.name)}
              className={`w-40 h-44 flex flex-col items-center justify-center rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 
                ${isActive
                  ? "border-2 border-green-600 bg-green-50 text-green-700 font-semibold"
                  : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`}
            >
              <div className="w-32 h-20 mb-2 flex items-center justify-center">
                <img
                  src={item.icon || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-[60px] rounded-lg object-fill"
                />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          )
        })}
      </aside>

      <main className="flex flex-col relative h-[calc(100vh-58px)]">
        <div className="flex justify-between items-start px-6 pt-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fire Fresh</h1>
            <p className="text-sm text-gray-500">Fresh & Healthy Food</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-500 font-semibold">
              {filteredProducts?.length} <span className="text-gray-500">Items</span>
            </p>
            <p className="text-sm text-orange-500 font-semibold">
              {categoryList.length - 1} <span className="text-gray-500">Categories</span>
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-28">
          {filteredProducts?.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredProducts?.map((product) => {
                const cartQuantity = getCartQuantity(product.id)
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      setShowModal(true)
                      setSelectedProduct(product)
                    }}
                    className={`border rounded-xl p-3 shadow-sm relative cursor-pointer transition duration-300 ease-in-out ${activeIndex === product?.id ? "ring-2 ring-[#22333b] shadow-md bg-purple-50" : "hover:shadow-md hover:scale-[1.02]"}`}
                  >
                    {cartQuantity > 0 && (
                      <div className="absolute -top-2 -right-2 bg-[#22333b] text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                        {cartQuantity}
                      </div>
                    )}
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.ItemName}
                      width={250}
                      height={150}
                      className="mx-auto h-[150px]"
                    />
                    <h3 className="text-center text-lg font-semibold mt-2">{product.ItemName}</h3>
                    <p className="text-xs text-center text-gray-500 mt-1">{product.ItemDesc}</p>
                    <div className="mt-2 flex justify-between items-center px-2">
                      <span className="font-bold text-2xl flex w-full justify-center text-gray-800">
                        KWD {product.Price.toFixed(3)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product,"add")
                        }}
                        className="w-12 h-12 bg-[#22333b] rounded-full text-white text-xl leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full p-10">No products Found...!</div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-16 py-6 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-xl font-semibold">
              <img
                src="https://i.pinimg.com/736x/00/9b/74/009b744ac549aca64fc353fba90412d4.jpg"
                alt="Cart"
                width={60}
                height={28}
              />
              <span>Total:</span>
              <span className="text-[#415a77]">KWD {subtotal.toFixed(3)}</span>
            </div>
            <div className="space-x-4">
              <button onClick={handleCart} className="px-6 py-3 rounded-xl bg-[#22333b] text-white text-lg font-bold">
                Checkout
              </button>
              <button onClick={handleCancel} className="px-6 py-3 rounded-xl bg-red-600 text-white text-lg font-bold">
                Cancel
              </button>
            </div>
          </div>
        )}
        {showCustomerModal && (
          <CustomerModal onClose={() => setShowCustomerModal(false)} />
        )}

        {showModal && selectedProduct && (
          <div ref={modalRef} className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm flex justify-center items-end sm:items-center transition-all">
            <div className="bg-white w-full sm:w-[480px] max-h-[95%] rounded-t-3xl sm:rounded-2xl px-6 pt-6 pb-10 animate-slide-up overflow-y-auto hide-scrollbar shadow-2xl relative">

              {/* Grabber */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-300 rounded-full"></div>

              {/* Product Info */}
              <div className="flex flex-col items-center mt-6 text-center">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt="Item"
                  className="w-60 h-32 object-cover border-4 border-white shadow-md"
                />
                <h2 className="text-2xl font-bold mt-4 text-gray-800">{selectedProduct.name}</h2>
                <p className="text-xl text-[#22333b] font-semibold mt-1">KWD {basePrice?.toFixed(3)}</p>

               {/* Quantity Selector */}
<div className="flex items-center mt-6 space-x-6">
  <button
    onClick={() => handleAddToCart(selectedProduct, "minus")}
    disabled={getCartQuantity(selectedProduct.id) <= 0}
    className={`w-14 h-14 rounded-full text-white text-3xl font-bold ${
      getCartQuantity(selectedProduct.id) <= 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#22333b] hover:bg-[#415a77]"
    }`}
  >
    −
  </button>

  <span className="text-2xl font-bold text-gray-900">
    {getCartQuantity(selectedProduct.id) > 0 ? getCartQuantity(selectedProduct.id) : "0"}
  </span>

  <button
    onClick={() => handleAddToCart(selectedProduct, "add")}
    className="w-14 h-14 rounded-full bg-[#22333b] text-white text-3xl font-bold hover:bg-[#415a77]"
  >
    +
  </button>
</div>

              </div>
              {isInvalid && (
        <p className="text-red-500">Quantity cannot be less than 0</p>
      )}
              {/* Extras / Crusts */}
              {crustOptions.length > 0 && (
                <div className="mt-8">
                  <p className="text-lg font-bold text-gray-800 mb-3">Extras</p>
                  <div className="space-y-3">
                    {crustOptions.map((opt:any, idx:any) => (
                      <label key={idx} className="flex justify-between items-center border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-[#22333b] transition-all">
                        <span className="text-lg text-gray-800">{opt.name}</span>
                        <span className="text-md text-gray-500">{opt.price.toFixed(3)} KWD</span>
                        <input
                          type="checkbox"
                          checked={selections.crust.includes(opt.id)}
                          onChange={() => handleCrustToggle(opt.id,selectedProduct)}
                          className="w-6 h-6 accent-[#22333b] ml-4"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl border-2 border-[#22333b] text-[#22333b] text-lg font-semibold hover:bg-purple-50"
                >
                  Back to Menu
                </button>
                <button
                  onClick={() => handleCart()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#22333b] text-white text-lg font-bold hover:bg-[#415a77]"
                >
                  Add to cart – KWD {calculateTotal.toFixed(3)}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
