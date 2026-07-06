// TheMealDB API آدرس قیمت واقعی برندارد، بنابراین یک قیمت ثابت و قابل تکرار
// بر اساس شناسه‌ی غذا تولید می‌کنیم تا تجربه‌ی خرید کامل شود.

export function getMealPrice(idMeal) {
  if (!idMeal) return 0
  let hash = 0
  const str = String(idMeal)
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000
  }
  // بازه‌ی قیمتی: ۸۵٬۰۰۰ تا ۲۴۵٬۰۰۰ تومان
  const price = 85000 + (hash % 17) * 10000
  return price
}

export function formatToman(amount) {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

export function cartTotal(items) {
  return items.reduce((sum, i) => sum + getMealPrice(i.idMeal) * (i.quantity || 1), 0)
}
