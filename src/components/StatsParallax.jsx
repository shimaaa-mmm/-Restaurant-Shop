import React, { useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

function Counter({ to, suffix = '', duration = 1.8 }) {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.floor(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl font-bold text-saffron-400">
      {val.toLocaleString('fa-IR')}
      {suffix}
    </span>
  )
}

const stats = [
  { to: 120, suffix: '+', label: 'مدل غذای اصیل' },
  { to: 8500, suffix: '+', label: 'مشتری راضی' },
  { to: 12, suffix: '', label: 'سال تجربه' },
  { to: 45, suffix: ' دقیقه', label: 'میانگین زمان ارسال' },
]

export default function StatsParallax() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative my-14 overflow-hidden rounded-3xl h-72 md:h-80 w-full">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1950&q=80')",
          transform: `translateY(${scrollY * 0.08}px) scale(1.1)`,
        }}
      />
      <div className="absolute inset-0 bg-ink-800/80" />

      <div className="relative z-10 h-full grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center px-6">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Counter to={s.to} suffix={s.suffix} />
            <p className="text-cream-100/80 text-xs md:text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
