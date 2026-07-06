import React, { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RatingStars from './RatingStars'

const reviews = [
  {
    name: 'سارا احمدی',
    text: 'کیفیت غذا فوق‌العاده بود و بسته‌بندی خیلی شیک. حتماً دوباره سفارش می‌دم.',
    rating: 5,
    avatar: '🧕',
  },
  {
    name: 'علی رضایی',
    text: 'سرعت ارسال عالی بود، غذا هنوز داغ بود وقتی رسید. تجربه‌ی خیلی خوبی بود.',
    rating: 4.5,
    avatar: '🧑',
  },
  {
    name: 'مریم کریمی',
    text: 'طعم غذاها دقیقاً مثل خونگی بود. از منوی متنوعشون خیلی خوشم اومد.',
    rating: 5,
    avatar: '👩',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const next = useCallback(() => setIndex((i) => (i + 1) % reviews.length), [])

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  const r = reviews[index]

  return (
    <div className="my-14 bg-white rounded-3xl shadow-card px-6 md:px-16 py-12 text-center relative overflow-hidden">
      <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-700 mb-8 saffron-underline w-fit mx-auto">
        نظرات مشتریان
      </h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45 }}
          className="max-w-xl mx-auto"
        >
          <span className="text-5xl">{r.avatar}</span>
          <p className="text-ink-500 leading-relaxed my-5 text-base md:text-lg">“{r.text}”</p>
          <p className="font-bold text-ink-700 mb-2">{r.name}</p>
          <div className="flex justify-center">
            <RatingStars rating={r.rating} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`نظر ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-saffron-500' : 'w-1.5 bg-ink-100 hover:bg-ink-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
