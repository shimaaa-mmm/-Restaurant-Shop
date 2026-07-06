import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { logout } from '../features/auth/authSlice'

export default function Header() {
  const auth = useSelector((s) => s.auth)
  const cart = useSelector((s) => s.cart)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
    nav('/login')
  }

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > lastScrollY && y > 120) setVisible(false)
      else setVisible(true)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 font-medium transition-colors duration-300 ${
      isActive ? 'text-saffron-500' : 'text-cream-100/85 hover:text-saffron-300'
    }`

  const cartCount = cart.items.reduce((n, i) => n + (i.quantity || 1), 0)

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${scrolled ? 'shadow-soft bg-ink-800/95 backdrop-blur-md' : 'bg-ink-800/80 backdrop-blur-sm'}`}
    >
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* برند */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl group-hover:animate-floaty">🍽️</span>
          <span className="font-display text-xl md:text-2xl font-bold text-cream-50">
            رستوران <span className="text-saffron-400">ما</span>
          </span>
        </Link>

        {/* ناوبری دسکتاپ */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            منو
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            <span className="relative">
              سبد خرید
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -left-3 bg-saffron-500 text-ink-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </NavLink>

          {auth.user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                داشبورد
              </NavLink>
              <button
                onClick={handleLogout}
                className="mr-2 px-4 py-1.5 rounded-full bg-paprika-500 text-cream-50 text-sm font-semibold hover:bg-paprika-600 transition-colors duration-300"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                ورود
              </NavLink>
              <NavLink
                to="/register"
                className="mr-2 px-4 py-1.5 rounded-full bg-saffron-500 text-ink-800 text-sm font-bold hover:bg-saffron-400 transition-colors duration-300"
              >
                ثبت‌نام
              </NavLink>
            </>
          )}
        </nav>

        {/* دکمه منو موبایل */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-cream-50 relative w-9 h-9 flex items-center justify-center"
          aria-label="باز کردن منو"
        >
          <span className="relative w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current rounded transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 bg-current rounded transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-current rounded transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>
          {cartCount > 0 && !menuOpen && (
            <span className="absolute -top-1 -left-1 bg-saffron-500 text-ink-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-ink-800/98 border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
                منو
              </NavLink>
              <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
                سبد خرید {cartCount > 0 && `(${cartCount})`}
              </NavLink>
              {auth.user ? (
                <>
                  <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
                    داشبورد
                  </NavLink>
                  <button onClick={handleLogout} className="text-right px-3 py-2 text-paprika-400 font-semibold">
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                    ورود
                  </NavLink>
                  <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>
                    ثبت‌نام
                  </NavLink>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
