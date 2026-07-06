export function getMealRating(idMeal) {
  if (!idMeal) return { rating: 4.5, reviews: 10 }
  let hash = 0
  const str = String(idMeal)
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 17 + str.charCodeAt(i)) % 1000
  }
  const rating = (3.6 + (hash % 15) / 10).toFixed(1) // 3.6 - 5.0
  const reviews = 12 + (hash % 240)
  return { rating: Number(rating), reviews }
}
