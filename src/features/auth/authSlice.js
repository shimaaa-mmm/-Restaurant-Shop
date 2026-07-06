import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from './AuthService'

const initialState = {
  user: AuthService.getCurrentUser(),
  token: localStorage.getItem('auth_token') || null,
  status: 'idle',
  error: null
}

export const registerUser = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  const res = AuthService.register(payload)
  if (res.error) return thunkAPI.rejectWithValue(res.error)
  return res.user
})

export const loginUser = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  const res = AuthService.login(payload)
  if (res.error) return thunkAPI.rejectWithValue(res.error)
  return res
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      AuthService.logout()
      state.user = null
      state.token = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => { state.status = 'loading'; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginUser.pending, state => { state.status = 'loading'; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
