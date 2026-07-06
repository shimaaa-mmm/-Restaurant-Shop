import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-white/90 backdrop-blur-sm rounded-3xl shadow-card max-w-2xl mx-auto"
    >
      <span className="text-7xl mb-6 animate-floaty inline-block">🍽️</span>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-700 mb-4">
        این میز خالی است
      </h1>
      <p className="text-ink-400 text-lg mb-8 max-w-md">
        صفحه‌ای که دنبالش بودید پیدا نشد. شاید آدرس اشتباه است یا این غذا از منو حذف شده.
      </p>
      <Link
        to="/"
        className="px-8 py-3 rounded-full bg-saffron-500 text-ink-800 font-bold shadow-glow hover:bg-saffron-400 transition-colors duration-300"
      >
        بازگشت به منو
      </Link>
    </motion.div>
  )
}
