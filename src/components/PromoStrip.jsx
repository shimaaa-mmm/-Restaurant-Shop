import React from 'react'
import { motion } from 'framer-motion'

const features = [
  { icon: '🚚', title: 'ارسال رایگان', desc: 'برای سفارش‌های بالای ۵۰۰ هزار تومان' },
  { icon: '🔒', title: 'پرداخت امن', desc: 'درگاه رمزنگاری‌شده و مطمئن' },
  { icon: '🌿', title: 'مواد تازه', desc: 'تهیه‌شده از بازار محلی هر روز' },
  { icon: '☎️', title: 'پشتیبانی ۲۴ ساعته', desc: 'همیشه در کنار شما هستیم' },
]

export default function PromoStrip() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-card -mt-10 relative z-20 px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="flex flex-col items-center text-center gap-2 md:flex-row md:text-right md:gap-3"
        >
          <span className="text-3xl flex-shrink-0">{f.icon}</span>
          <div>
            <p className="font-bold text-ink-700 text-sm">{f.title}</p>
            <p className="text-xs text-ink-400">{f.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
