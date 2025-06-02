"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import {addToCart, removeFromCart, updateQuantity  } from "../../store/cart/cartSlice"

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side rendering
  useState(() => {
    setIsClient(true)
  })
  const handleAddToCart = (item: any, type: any) => {
    const quantity = type === "add" ? 1 : -1;
  //   const quantities = getCartQuantity(item.id);
  // const isInvalid = quantity < 0;
  // setisInvalid(isInvalid)

    const cartItem = {
      ...item,
      quantity,
    };
  
    dispatch(addToCart(cartItem));
  };
  
  const updateItemQuantity = (id: string, delta: number) => {
    const item = cartItems.find((item:any) => item.id === id)
    if (!item) return

    const newQuantity = Math.max(1, item.quantity + delta)
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handlePayment = () => {
    router.push("/Payment")
  }
// console.log("{cartItems.map((item:any) => (",cartItems.map((item:any) => (item)))
const calculateItemTotal = (item: any) => {
  const basePrice = parseFloat(item.Price?.toString() || '0'); // already includes quantity
  if (isNaN(basePrice)) return 0;

  const crustOptionsTotal = item.crustOptions?.reduce((total: number, option: any) => {
    const optionPrice = parseFloat(option.price);
    return isNaN(optionPrice) ? total : total + optionPrice; // just add once per option
  }, 0) || 0;

  return basePrice + crustOptionsTotal;
};

const totalPrice = cartItems.reduce(
  (sum: number, item: any) => sum + calculateItemTotal(item),
  0
);


  if (!isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen px-10 bg-white">
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-sm text-gray-400 mt-1">Your cart is empty</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">Add some items to your cart to continue</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] px-10 bg-white">
      {/* Page Header */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-sm text-gray-400 mt-1">Review your selected items</p>
      </div>

      {/* Cart List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
     
      {cartItems.map((item) => (
  <div
    key={item.id}
    className="flex items-start justify-between p-3 bg-gray-50 rounded-xl shadow-sm"
  >
    {/* Left: Image + Info */}
    <div className="flex items-start gap-3 flex-1">
      <div className="w-14 h-14 rounded overflow-hidden bg-gray-200">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.ItemName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col text-sm">
        <span className="font-semibold text-gray-800">{item.ItemName}</span>

        {/* Crust Options */}
        {item.crustOptions?.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600">
            {item.crustOptions.map((crust) => (
              <div
                key={crust.id}
                className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
              >
                <span>
                  {crust.name} x{crust.quantity} (+KWD{" "}
                  {(parseFloat(crust.price) * crust.quantity).toFixed(3)})
                </span>
                <button
                  className="text-red-500 text-sm ml-2"
                  onClick={() =>
                    dispatch(removeFromCart({ id: item.id, crustOptionId: crust.id }))
                  }
                  title="Remove crust"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Right: Price, Quantity & Delete */}
    <div className="flex flex-row px-4 items-center gap-2 text-right">

  {/* Price */}
  <span className="text-lg font-semibold px-5 text-cyan-800 tracking-wide">
    KWD {item.Price}
  </span>

  {/* Quantity Control */}
  <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
    <button
      onClick={() =>
        handleAddToCart(item,"minus")}
        disabled={item.quantity <= 1}
        className={`px-2 py-1 rounded ${
          item.quantity <= 1 ? 'bg-gray-300 text-gray-500 rounded-full cursor-not-allowed p-1 w-7 h-7 flex items-center justify-center' : 'text-gray-700 hover:text-white hover:bg-red-400 transition-colors duration-200 rounded-full p-1 w-7 h-7 flex items-center justify-center'
        }`}
      title="Decrease"
    >

      −
    </button>
    <span className="mx-2 text-sm font-medium text-gray-700 min-w-[1.5rem] text-center">
      {item.quantity}
    </span>
    <button
      onClick={() =>
        handleAddToCart(item,"add")} 
      
      className="text-gray-700 hover:text-white hover:bg-green-500 transition-colors duration-200 rounded-full p-1 w-7 h-7 flex items-center justify-center"
      title="Increase"
    >
      +
    </button>
  </div>

  {/* Delete Button */}
  <button
    onClick={() => dispatch(removeFromCart({ id: item.id }))}
    className="text-red-500 hover:bg-red-100 transition-all duration-200 px-2 py-1 rounded-md text-xs font-medium mt-1"
    title="Remove item from cart"
  >
    🗑️ Remove
  </button>

    </div>
  </div>
))}



      </div>

      {/* Checkout Footer */}
      <div className="px-6 py-4 border-t bg-white shadow-inner flex justify-between items-center">
        <section className="flex">
          <div className="w-12 h-12">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd7R7HH-QnamMllS_Pado26K3_41TS0qdFa6TnPM9-rWGXL2GciB2piYw&s"
              alt="Payment logo"
            />
          </div>
          <div className="flex flex-col px-10">
            <span className="text-xs text-gray-400">Total</span>
            <span className="text-lg font-bold text-gray-800">KWD {totalPrice.toFixed(2)}</span>
          </div>
        </section>
        <button
          onClick={handlePayment}
          className="bg-black text-white px-24 py-5 rounded-full font-semibold hover:bg-gray-900 transition"
        >
          Proceed to payment
        </button>
      </div>
    </div>
  )
}
