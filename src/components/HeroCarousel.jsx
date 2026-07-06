import React, { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80',
    eyebrow: 'طعم اصیل ایرانی',
    title: 'رستوران ما',
    subtitle: 'از دیزی سنتی تا غذاهای بین‌المللی؛ هر لقمه با عشق و زعفران ایرانی',
    cta: { label: 'مشاهده منو', to: '/' },
  },
  {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1950&q=80',
    eyebrow: 'تازه و دست‌ساز',
    title: 'با مواد اولیه‌ی درجه یک',
    subtitle: 'هر روز صبح، تازه‌ترین مواد از بازار محلی برای آشپزخانه‌ی ما می‌رسد',
    cta: { label: 'کشف غذاها', to: '/' },
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1950&q=80',
    eyebrow: 'ارسال سریع',
    title: 'تحویل درِ منزل',
    subtitle: 'سفارش آنلاین با پرداخت امن، حداکثر تا ۴۵ دقیقه دم در شما',
    cta: { label: 'سفارش بده', to: '/' },
  },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [])
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [next])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slide = slides[index]

  return (
    <div className="relative w-full h-[30rem] md:h-[36rem] overflow-hidden bg-ink-800">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.04 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${slide.image}')`,
            transform: `translateY(${scrollY * 0.25}px)`,
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-800/90 via-ink-800/60 to-ink-800/95" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[36rem] h-[20rem] bg-saffron-500/30 blur-[100px] rounded-full" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-saffron-300 tracking-[0.3em] text-xs md:text-sm font-semibold mb-4">
              {slide.eyebrow}
            </span>
            <h1 className="font-display text-white text-4xl md:text-6xl font-bold saffron-underline mb-6">
              {slide.title}
            </h1>
            <p className="text-cream-100/80 max-w-xl text-sm md:text-base mb-8">
              {slide.subtitle}
            </p>
            <Link
              to={slide.cta.to}
              className="px-8 py-3 rounded-full bg-saffron-500 text-ink-800 font-bold shadow-glow hover:bg-saffron-400 transition-colors duration-300"
            >
              {slide.cta.label}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* پیکان‌ها */}
      <button
        onClick={prev}
        aria-label="اسلاید قبلی"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur-sm transition-colors"
      >
        ›
      </button>
      <button
        onClick={next}
        aria-label="اسلاید بعدی"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur-sm transition-colors"
      >
        ‹
      </button>

      {/* نشانگرها */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`رفتن به اسلاید ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-saffron-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
