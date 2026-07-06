import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { notify } from '../utils/notify'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@')) {
      notify.error('لطفاً یک ایمیل معتبر وارد کنید')
      return
    }
    notify.success('عضویت شما با موفقیت ثبت شد 🎉')
    setEmail('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-14 relative overflow-hidden rounded-3xl bg-ink-800 px-6 md:px-16 py-14 text-center"
    >
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-saffron-500/20 blur-[90px] rounded-full" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-paprika-500/20 blur-[90px] rounded-full" />

      <div className="relative z-10">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
          از تخفیف‌های ویژه باخبر شو
        </h3>
        <p className="text-cream-100/70 text-sm mb-8 max-w-md mx-auto">
          با عضویت در خبرنامه، پیشنهادهای هفتگی و کدهای تخفیف رستوران ما را زودتر از همه دریافت کنید
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل شما"
            className="flex-1 rounded-full px-5 py-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-saffron-500 text-ink-800 font-bold hover:bg-saffron-400 transition-colors shadow-glow"
          >
            عضویت
          </button>
        </form>
      </div>
    </motion.div>
  )
}
