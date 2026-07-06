import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { notify } from '../utils/notify'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedUser = username.trim()
    if (trimmedUser.length < 3) {
      notify.error('نام کاربری باید حداقل ۳ حرف باشد')
      return
    }
    if (password.length < 4) {
      notify.error('رمز عبور باید حداقل ۴ حرف باشد')
      return
    }
    setLoading(true)
    try {
      await dispatch(registerUser({ username: trimmedUser, password })).unwrap()
      notify.success('ثبت‌نام با موفقیت انجام شد، حالا وارد شوید')
      nav('/login')
    } catch (err) {
      notify.error('این نام کاربری قبلاً استفاده شده است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-saffron-100 rounded-[28px] shadow-card p-10"
      >
        <h2 className="font-display text-3xl font-bold mb-8 text-center text-ink-700">
          🧾 ثبت‌نام در رستوران
        </h2>

        {auth.error && (
          <p className="text-paprika-600 text-center mb-4 font-medium text-sm">
            ⚠️ این نام کاربری قبلاً استفاده شده است
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری"
            className="border border-ink-100 bg-cream-50 text-ink-700 rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:ring-4 focus:ring-saffron-200 transition placeholder:text-ink-300"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            type="password"
            className="border border-ink-100 bg-cream-50 text-ink-700 rounded-2xl px-5 py-3.5 text-base focus:outline-none focus:ring-4 focus:ring-saffron-200 transition placeholder:text-ink-300"
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-2 bg-saffron-500 text-ink-800 font-bold py-3.5 rounded-2xl shadow-glow hover:bg-saffron-400 transition-colors text-lg disabled:opacity-60"
          >
            {loading ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">
          قبلاً حساب دارید؟{' '}
          <Link to="/login" className="text-saffron-600 font-semibold hover:underline">
            ورود
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
