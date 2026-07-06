import { createSlice } from '@reduxjs/toolkit'

const KEY = 'restaurant_wishlist'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch (e) {
    return []
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: load() },
  reducers: {
    toggleWishlist(state, action) {
      const meal = action.payload
      const exists = state.items.find((i) => i.idMeal === meal.idMeal)
      if (exists) {
        state.items = state.items.filter((i) => i.idMeal !== meal.idMeal)
      } else {
        state.items.push(meal)
      }
      save(state.items)
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
