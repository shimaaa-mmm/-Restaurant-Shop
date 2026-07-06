import React from 'react'

export default function RatingStars({ rating, reviews, size = 'text-sm' }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5

  return (
    <div className={`flex items-center gap-1 ${size}`}>
      <span className="text-saffron-500 tracking-tighter" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return '★'
          if (i === full && hasHalf) return '⯨'
          return '☆'
        }).join('')}
      </span>
      <span className="text-ink-500 font-semibold">{rating}</span>
      {reviews != null && <span className="text-ink-300">({reviews.toLocaleString('fa-IR')})</span>}
    </div>
  )
}
