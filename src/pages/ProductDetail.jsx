import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMealById, filterByCategory } from '../api/mealApi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import { toggleWishlist } from '../features/wishlist/wishlistSlice'
import { motion } from 'framer-motion'
import { getMealPrice, formatToman } from '../utils/priceUtils'
import { getMealRating } from '../utils/ratingUtils'
import { notify } from '../utils/notify'
import RatingStars from '../components/RatingStars'

function getIngredients(meal) {
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) {
      list.push({ ing: ing.trim(), measure: measure ? measure.trim() : '' })
    }
  }
  return list
}

function getSteps(instructions) {
  if (!instructions) return []
  return instructions
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ProductDetail() {
  const { id } = useParams()
  const [meal, setMeal] = useState(null)
  const [qty, setQty] = useState(1)
  const [related, setRelated] = useState([])
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)
  const isWished = meal ? !!wishlist.find((w) => w.idMeal === meal.idMeal) : false

  function load() {
    setMeal(null)
    setError(false)
    setRelated([])
    getMealById(id)
      .then((m) => {
        setMeal(m)
        if (m && m.strCategory) {
          filterByCategory(m.strCategory).then((list) => {
            setRelated(list.filter((x) => x.idMeal !== m.idMeal).slice(0, 4))
          })
        }
      })
      .catch(() => setError(true))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (error) {
    return (
      <div className="w-full max-w-lg mx-auto py-24 text-center bg-white rounded-3xl shadow-card p-10">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-ink-500 mb-6">دریافت اطلاعات این غذا با مشکل مواجه شد.</p>
        <button
          onClick={load}
          className="px-6 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    )
  }

  if (!meal) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 flex flex-col items-center gap-4">
        <div className="skeleton h-72 w-full max-w-md rounded-3xl" />
        <div className="skeleton h-6 w-1/2 rounded-full" />
        <div className="skeleton h-4 w-2/3 rounded-full" />
      </div>
    )
  }

  const price = getMealPrice(meal.idMeal)
  const ingredients = getIngredients(meal)
  const steps = getSteps(meal.strInstructions)
  const tags = meal.strTags ? meal.strTags.split(',').filter(Boolean) : []

  function handleAdd() {
    if (!auth.user) {
      notify.warning('برای افزودن باید وارد شوید.')
      return
    }
    for (let i = 0; i < qty; i++) dispatch(addToCart(meal))
    notify.success(`${meal.strMeal} (${qty} عدد) به سبد اضافه شد`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[28px] shadow-card max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col gap-10"
      dir="rtl"
    >
      <Link to="/" className="text-sm text-ink-400 hover:text-saffron-600 transition-colors w-fit">
        ← بازگشت به منو
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* تصویر محصول */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="flex-1 flex justify-center items-start"
        >
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-soft">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-80 object-cover" />
            <span className="absolute top-4 right-4 bg-saffron-500 text-ink-800 font-bold px-4 py-1.5 rounded-full shadow-md">
              {formatToman(price)}
            </span>
            <button
              onClick={() => {
                dispatch(toggleWishlist(meal))
                notify.info(isWished ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد ❤️')
              }}
              aria-label="علاقه‌مندی"
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-lg hover:bg-white transition-colors"
            >
              {isWished ? '❤️' : '🤍'}
            </button>
          </div>
        </motion.div>

        {/* توضیحات و خرید */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-saffron-600 mb-2">
              {meal.strCategory} · {meal.strArea}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-700 mb-2 saffron-underline w-fit">
              {meal.strMeal}
            </h2>
            <div className="mb-3">
              <RatingStars rating={getMealRating(meal.idMeal).rating} reviews={getMealRating(meal.idMeal).reviews} />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map((t) => (
                  <span key={t} className="text-[11px] bg-saffron-50 text-saffron-700 px-2.5 py-1 rounded-full font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <p className="text-ink-400 leading-relaxed text-sm md:text-[15px] line-clamp-4">
              {meal.strInstructions}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white bg-paprika-500 hover:bg-paprika-600 px-4 py-2 rounded-full transition-colors"
              >
                ▶ ویدیوی طرز تهیه
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-ink-600 border border-ink-100 hover:bg-cream-100 px-4 py-2 rounded-full transition-colors"
              >
                🔗 منبع اصلی
              </a>
            )}
          </div>

          {ingredients.length > 0 && (
            <div>
              <h4 className="font-semibold text-ink-700 mb-3">مواد لازم</h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((it, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-cream-200 text-ink-600 px-3 py-1.5 rounded-full border border-ink-100/60"
                  >
                    {it.ing} {it.measure && <span className="text-ink-400">· {it.measure}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-2 pt-6 border-t border-ink-100">
            <div className="flex items-center gap-3 bg-cream-200 rounded-full px-2 py-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm font-bold text-ink-600 hover:text-saffron-600 transition"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-ink-700">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm font-bold text-ink-600 hover:text-saffron-600 transition"
              >
                +
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className="flex-1 px-6 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors duration-300"
            >
              افزودن به سبد · {formatToman(price * qty)}
            </motion.button>
          </div>
        </div>
      </div>

      {/* دستور پخت مرحله‌به‌مرحله */}
      {steps.length > 1 && (
        <div>
          <h4 className="font-display text-xl font-bold text-ink-700 mb-4">طرز تهیه</h4>
          <ol className="space-y-3">
            {steps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
                className="flex gap-3 items-start bg-cream-100 rounded-2xl p-4"
              >
                <span className="w-7 h-7 flex-shrink-0 rounded-full bg-saffron-500 text-ink-800 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="text-sm text-ink-600 leading-relaxed">{step}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      )}

      {/* غذاهای مشابه */}
      {related.length > 0 && (
        <div>
          <h4 className="font-display text-xl font-bold text-ink-700 mb-4">غذاهای مشابه</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.idMeal}
                to={`/product/${r.idMeal}`}
                className="group rounded-2xl overflow-hidden bg-cream-100 hover:shadow-card transition-shadow"
              >
                <div className="overflow-hidden h-28">
                  <img
                    src={r.strMealThumb}
                    alt={r.strMeal}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-ink-700 p-2 line-clamp-2">{r.strMeal}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
