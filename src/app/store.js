import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import mealReducer from '../features/meals/mealSlice'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  }
})

export default store
