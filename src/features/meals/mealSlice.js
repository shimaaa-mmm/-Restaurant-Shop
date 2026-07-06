import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../api/mealApi'

const initialState = {
  items: [],
  categories: [],
  areas: [],
  status: 'idle',
  error: null,
  randomMeal: null,
  randomStatus: 'idle',
}

export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (q = '') => {
  return await api.searchMeals(q)
})

export const fetchCategories = createAsyncThunk('meals/fetchCategories', async () => {
  return await api.getCategories()
})

export const fetchAreas = createAsyncThunk('meals/fetchAreas', async () => {
  return await api.getAreas()
})

export const filterCategory = createAsyncThunk('meals/filterCategory', async (cat) => {
  return await api.filterByCategory(cat)
})

export const filterArea = createAsyncThunk('meals/filterArea', async (area) => {
  return await api.filterByArea(area)
})

export const fetchRandomMeal = createAsyncThunk('meals/fetchRandomMeal', async () => {
  return await api.getRandomMeal()
})

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    clearRandomMeal(state) {
      state.randomMeal = null
      state.randomStatus = 'idle'
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMeals.pending, state => { state.status = 'loading' })
      .addCase(fetchMeals.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchMeals.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload })
      .addCase(fetchAreas.fulfilled, (state, action) => { state.areas = action.payload })
      .addCase(filterCategory.pending, state => { state.status = 'loading' })
      .addCase(filterCategory.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(filterArea.pending, state => { state.status = 'loading' })
      .addCase(filterArea.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchRandomMeal.pending, state => { state.randomStatus = 'loading' })
      .addCase(fetchRandomMeal.fulfilled, (state, action) => { state.randomStatus = 'succeeded'; state.randomMeal = action.payload })
      .addCase(fetchRandomMeal.rejected, state => { state.randomStatus = 'failed' })
  }
})

export const { clearRandomMeal } = mealSlice.actions
export default mealSlice.reducer
