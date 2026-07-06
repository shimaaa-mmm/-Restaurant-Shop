import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMealById } from '../api/mealApi'
import { getMealPrice, formatToman } from '../utils/priceUtils'
import Modal from './Modal'

function getIngredients(meal) {
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) list.push({ ing: ing.trim(), measure: measure ? measure.trim() : '' })
  }
  return list
}

export default function QuickViewModal({ mealId, open, onClose, onAdd }) {
  const [meal, setMeal] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (open && mealId) {
      setMeal(null)
      setQty(1)
      getMealById(mealId).then(setMeal)
    }
  }, [open, mealId])

  const price = meal ? getMealPrice(meal.idMeal) : 0

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      {!meal ? (
        <div className="p-8 space-y-4">
          <div className="skeleton h-56 w-full rounded-2xl" />
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton h-3 w-full" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-56 md:h-full object-cover" />
            <span className="absolute bottom-3 right-3 bg-saffron-500 text-ink-800 font-bold px-3 py-1 rounded-full text-sm shadow-md">
              {formatToman(price)}
            </span>
          </div>

          <div className="md:w-1/2 p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-saffron-600 mb-1">
                {meal.strCategory} · {meal.strArea}
              </p>
              <h3 className="font-display text-xl font-bold text-ink-700">{meal.strMeal}</h3>
            </div>

            <p className="text-ink-400 text-sm line-clamp-4 flex-1">{meal.strInstructions}</p>

            {getIngredients(meal).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {getIngredients(meal).slice(0, 6).map((it, idx) => (
                  <span key={idx} className="text-[11px] bg-cream-200 text-ink-600 px-2 py-1 rounded-full">
                    {it.ing}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 bg-cream-100 rounded-full px-2 py-1 w-fit">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white shadow-sm font-bold text-ink-600 hover:text-saffron-600 transition"
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-ink-700 text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-white shadow-sm font-bold text-ink-600 hover:text-saffron-600 transition"
              >
                +
              </button>
            </div>

            <div className="flex gap-2 mt-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onAdd(meal, qty)
                  onClose()
                }}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-bold text-ink-800 bg-saffron-500 hover:bg-saffron-400 shadow-glow transition-colors"
              >
                افزودن به سبد
              </motion.button>
              <Link
                to={`/product/${meal.idMeal}`}
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-sm font-semibold border border-ink-100 text-ink-600 hover:bg-cream-100 transition-colors"
              >
                جزئیات کامل
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
