import { createSlice } from '@reduxjs/toolkit'

const CART_KEY = 'restaurant_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch (e) {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addToCart(state, action) {
      const item = action.payload
      const exists = state.items.find(i => i.idMeal === item.idMeal)
      if (exists) {
        exists.quantity = (exists.quantity || 1) + 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
      saveCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.idMeal !== action.payload)
      saveCart(state.items)
    },
    incrementQty(state, action) {
      const item = state.items.find(i => i.idMeal === action.payload)
      if (item) item.quantity = (item.quantity || 1) + 1
      saveCart(state.items)
    },
    decrementQty(state, action) {
      const item = state.items.find(i => i.idMeal === action.payload)
      if (item) {
        item.quantity = (item.quantity || 1) - 1
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.idMeal !== action.payload)
        }
      }
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    }
  }
})

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
