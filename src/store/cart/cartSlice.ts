import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CrustOption {
  id: string;
  name: string;
  price: any;
  quantity: number;
}

interface CartItem {
  id: string;
  ItemName: string;
  name: string;
  Price: any;
  unitPrice: string;
  quantity: number;
  image?: string;
  modifications?: string[];
  crustOptions?: CrustOption[];
  optionalProducts?: { id: string; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
}

// SSR-safe storage helper
const storage = {
  get: (key: string) => {
    try {
      // Only try to parse localStorage in useEffect or event handlers
      return { items: [] };
    } catch {
      return { items: [] };
    }
  },
  set: (key: string, value: any) => {
    try {
    
        localStorage.setItem(key, JSON.stringify(value));
      // }
    } catch {
      // Handle storage errors silently
    }
  }
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          state.items = JSON.parse(savedCart);
        }
      } catch {
        state.items = [];
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      const crustOptions = Array.isArray(action.payload.crustOptions) ? action.payload.crustOptions : [];
      
      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        const basePrice = parseFloat(existingItem.unitPrice);
        
        const newQuantity = existingItem.quantity + action.payload.quantity;
        const itemPriceTotal = basePrice * newQuantity;

        existingItem.quantity = newQuantity;
        existingItem.Price = itemPriceTotal.toFixed(2);

        crustOptions?.forEach(newOption => {
          const existingOptionIndex = existingItem.crustOptions?.findIndex(opt => opt.id === newOption.id) ?? -1;
          if (existingOptionIndex !== -1 && existingItem.crustOptions) {
            existingItem.crustOptions[existingOptionIndex].quantity += newOption?.quantity || 1;
          } else {
            if (!existingItem.crustOptions) existingItem.crustOptions = [];
            existingItem.crustOptions.push({ ...newOption, quantity: newOption.quantity || 1 });
          }
        });
      } else {
        const basePrice = parseFloat(action.payload.Price) || 0;
        
        const itemPriceTotal = basePrice * action.payload.quantity;

        state.items.push({
          ...action.payload,
          unitPrice: basePrice.toFixed(2),
          Price: itemPriceTotal.toFixed(2),
          crustOptions: crustOptions.map(option => ({
            ...option,
            quantity: option.quantity || 1
          }))
        });
      }

      storage.set('cart', state.items);
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; crustOptionId?: string }>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (action.payload.crustOptionId && item.crustOptions) {
          const optionIndex = item.crustOptions.findIndex(opt => opt.id === action.payload.crustOptionId);
          if (optionIndex !== -1) {
            item.crustOptions.splice(optionIndex, 1);
            if (item.crustOptions.length === 0) {
              item.crustOptions = undefined;
            }
          }
        } else {
          state.items.splice(itemIndex, 1);
        }
      }

      storage.set('cart', state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; crustOptionId?: string; quantity: number }>) => {
      const { id, crustOptionId, quantity } = action.payload;
    
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
    
        // Update crust option quantity
        if (crustOptionId && item.crustOptions) {
          const optionIndex = item.crustOptions.findIndex(opt => opt.id === crustOptionId);
          if (optionIndex !== -1) {
            item.crustOptions[optionIndex].quantity = Math.max(0, quantity);
    
            // Remove the crust option if quantity becomes 0
            if (item.crustOptions[optionIndex].quantity === 0) {
              item.crustOptions.splice(optionIndex, 1);
            }
          }
        } else {
          // Update base item quantity
          item.quantity = Math.max(0, quantity);
        }
    
        // Recalculate total price
        const basePrice = parseFloat(item.unitPrice) || 0;
        const baseTotal = basePrice * item.quantity;
    
        const crustTotal = item.crustOptions?.reduce((sum, opt) => {
          const optPrice = parseFloat(opt.price) || 0;
          return sum + optPrice * (opt.quantity || 0);
        }, 0) || 0;
    
        item.Price = (baseTotal + crustTotal).toFixed(2);
    
        // Remove item if both base and crust options are 0
        const isItemEmpty = item.quantity === 0 && (!item.crustOptions || item.crustOptions.length === 0);
        if (isItemEmpty) {
          state.items.splice(itemIndex, 1);
        }
      }
    
      storage.set('cart', state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      storage.set('cart', state.items);
    }
  }
});

export const { initializeCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;