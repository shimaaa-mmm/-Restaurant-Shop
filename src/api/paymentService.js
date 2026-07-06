// این سرویس، رفتار یک درگاه پرداخت واقعی را شبیه‌سازی می‌کند:
// اعتبارسنجی شماره کارت با الگوریتم Luhn (همان الگوریتمی که بانک‌ها استفاده می‌کنند)،
// بررسی تاریخ انقضا و CVV، و یک تأخیر شبکه‌ی واقعی برای تجربه‌ی صادقانه.
//
// برای اتصال به یک درگاه واقعی (زرین‌پال / آیدی‌پی و مشابه)، این تابع باید یک
// درخواست به بک‌اند شما بزند و بک‌اند با API درگاه صحبت کند — کلید درگاه هرگز
// نباید در فرانت‌اند قرار گیرد.

export function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export function detectCardBrand(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '')
  if (/^6(037|219|363)/.test(digits)) return 'ملی کارت'
  if (/^(589210|627412|627381|639347)/.test(digits)) return 'سامان'
  if (/^(603799)/.test(digits)) return 'ملی'
  if (/^(610433|991975)/.test(digits)) return 'ملت'
  if (/^(627760)/.test(digits)) return 'پست بانک'
  if (/^(502229)/.test(digits)) return 'پاسارگاد'
  return 'کارت بانکی'
}

export function validateExpiry(mmYY) {
  const match = /^(\d{2})\/(\d{2})$/.exec(mmYY)
  if (!match) return false
  const month = parseInt(match[1], 10)
  const year = 2000 + parseInt(match[2], 10)
  if (month < 1 || month > 12) return false
  const now = new Date()
  const exp = new Date(year, month, 0, 23, 59, 59)
  return exp >= now
}

export async function chargeCard({ cardNumber, expiry, cvv, holder, amount }) {
  await new Promise((r) => setTimeout(r, 1400)) // شبیه‌سازی تماس با درگاه بانکی

  if (!luhnCheck(cardNumber)) {
    return { ok: false, error: 'شماره کارت نامعتبر است' }
  }
  if (!validateExpiry(expiry)) {
    return { ok: false, error: 'تاریخ انقضای کارت نامعتبر یا منقضی شده است' }
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    return { ok: false, error: 'CVV۲ نامعتبر است' }
  }
  if (!holder || holder.trim().length < 3) {
    return { ok: false, error: 'نام صاحب کارت را وارد کنید' }
  }

  return {
    ok: true,
    refId: 'RF' + Math.floor(100000000 + Math.random() * 899999999),
    amount,
    brand: detectCardBrand(cardNumber),
  }
}
