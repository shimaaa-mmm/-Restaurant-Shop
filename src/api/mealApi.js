import http from './http'

const BASE = 'https://www.themealdb.com/api/json/v1/1'
const CACHE_PREFIX = 'meal_cache_'

function saveCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch (e) {
    /* noop */
  }
}

function loadCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw).data
  } catch (e) {
    return null
  }
}

// اگر API واقعی در دسترس نبود (قطعی، محدودیت نرخ و...) آخرین نتیجه‌ی موفق از کش نمایش داده می‌شود
// تا برنامه همیشه برای کاربر کار کند.
async function safeGet(url, cacheKey) {
  try {
    const res = await http.get(url)
    if (cacheKey) saveCache(cacheKey, res.data)
    return res.data
  } catch (err) {
    if (cacheKey) {
      const cached = loadCache(cacheKey)
      if (cached) return cached
    }
    throw err
  }
}

export async function searchMeals(q = '') {
  const url = q ? `${BASE}/search.php?s=${encodeURIComponent(q)}` : `${BASE}/search.php?f=a`
  const data = await safeGet(url, q ? null : 'meals_all')
  return data.meals || []
}

export async function getMealById(id) {
  const data = await safeGet(`${BASE}/lookup.php?i=${id}`, `meal_${id}`)
  return (data.meals && data.meals[0]) || null
}

export async function getCategories() {
  const data = await safeGet(`${BASE}/categories.php`, 'categories')
  return data.categories || []
}

export async function getAreas() {
  const data = await safeGet(`${BASE}/list.php?a=list`, 'areas')
  return data.meals || []
}

export async function filterByCategory(cat) {
  const data = await safeGet(`${BASE}/filter.php?c=${encodeURIComponent(cat)}`)
  return data.meals || []
}

export async function filterByArea(area) {
  const data = await safeGet(`${BASE}/filter.php?a=${encodeURIComponent(area)}`)
  return data.meals || []
}

export async function getRandomMeal() {
  const data = await safeGet(`${BASE}/random.php`)
  return (data.meals && data.meals[0]) || null
}
