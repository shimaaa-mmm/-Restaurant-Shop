import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink-800 text-cream-100 mt-16 border-t border-white/10">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-2xl font-bold mb-3">
            رستوران <span className="text-saffron-400">ما</span>
          </h3>
          <p className="text-sm text-cream-100/70 leading-relaxed">
            دمو فروشگاه رستوران با React، Redux Toolkit و طعم اصیل ایرانی —
            هر سفارش با زعفران و عشق آماده می‌شود.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-saffron-400 mb-4">دسترسی سریع</h4>
          <ul className="space-y-2 text-sm text-cream-100/80">
            <li><Link to="/" className="hover:text-saffron-300 transition-colors">منو</Link></li>
            <li><Link to="/cart" className="hover:text-saffron-300 transition-colors">سبد خرید</Link></li>
            <li><Link to="/login" className="hover:text-saffron-300 transition-colors">ورود</Link></li>
            <li><Link to="/register" className="hover:text-saffron-300 transition-colors">ثبت‌نام</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-saffron-400 mb-4">تماس با ما</h4>
          <ul className="space-y-2 text-sm text-cream-100/80">
            <li>📧 hello@example.com</li>
            <li>📞 ۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li>📍 تهران، ایران</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-cream-100/50">
          © {new Date().getFullYear()} رستوران ما. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  )
}
