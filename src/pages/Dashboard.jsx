import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getMealPrice, formatToman, cartTotal } from "../utils/priceUtils";
import { getOrdersForUser } from "../utils/orderHistory";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { notify } from "../utils/notify";

function MiniBarChart({ orders }) {
  const data = orders.slice(0, 6).reverse();
  if (data.length === 0) return null;
  const max = Math.max(...data.map((o) => o.total), 1);

  return (
    <div className="flex items-end gap-3 h-32 px-1">
      {data.map((o, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(o.total / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[26px] bg-gradient-to-t from-saffron-500 to-saffron-300 rounded-full min-h-[6px]"
            title={formatToman(o.total)}
          />
          <span className="text-[10px] text-ink-300">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

const statusStyles = {
  "در حال آماده‌سازی": "bg-saffron-50 text-saffron-700",
  "ارسال شده": "bg-blue-50 text-blue-700",
  "تحویل شده": "bg-green-50 text-green-700",
};

export default function Dashboard() {
  const auth = useSelector((s) => s.auth);
  const cart = useSelector((s) => s.cart);
  const wishlist = useSelector((s) => s.wishlist.items);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("orders");

  const orders = useMemo(
    () => (auth.user ? getOrdersForUser(auth.user.username) : []),
    [auth.user]
  );

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const currentCartTotal = cartTotal(cart.items);

  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      {/* پروفایل */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-ink-800 rounded-[28px] shadow-card p-8 md:p-10 mb-8 relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-saffron-500/20 blur-[80px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-saffron-500 text-ink-800 flex items-center justify-center font-bold text-2xl flex-shrink-0">
              {auth.user ? auth.user.username.charAt(0).toUpperCase() : "?"}
            </span>
            <div>
              <p className="text-cream-100/60 text-xs">خوش آمدید</p>
              <p className="font-display font-bold text-white text-2xl">
                {auth.user ? auth.user.username : "---"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <p className="font-bold text-saffron-400 text-xl md:text-2xl">{orders.length}</p>
              <p className="text-cream-100/60 text-[11px] md:text-xs">سفارش ثبت‌شده</p>
            </div>
            <div>
              <p className="font-bold text-saffron-400 text-xl md:text-2xl">{formatToman(totalSpent)}</p>
              <p className="text-cream-100/60 text-[11px] md:text-xs">مجموع خرید</p>
            </div>
            <div>
              <p className="font-bold text-saffron-400 text-xl md:text-2xl">{wishlist.length}</p>
              <p className="text-cream-100/60 text-[11px] md:text-xs">علاقه‌مندی</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* نمودار خرید */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 bg-white rounded-3xl shadow-card p-6"
        >
          <h4 className="font-bold text-ink-700 mb-4">روند سفارش‌های اخیر</h4>
          {orders.length > 0 ? (
            <MiniBarChart orders={orders} />
          ) : (
            <p className="text-ink-400 text-sm text-center py-8">هنوز سفارشی ثبت نشده</p>
          )}
          <div className="mt-6 pt-6 border-t border-ink-100 flex justify-between text-sm">
            <span className="text-ink-400">سبد فعلی</span>
            <span className="font-bold text-ink-700">{formatToman(currentCartTotal)}</span>
          </div>
          <Link
            to="/"
            className="block text-center mt-6 px-5 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors text-sm"
          >
            بازگشت به منو
          </Link>
        </motion.div>

        {/* تب‌ها: سفارش‌ها / علاقه‌مندی‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6"
        >
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === "orders" ? "bg-saffron-500 text-ink-800" : "bg-cream-100 text-ink-500"
              }`}
            >
              سفارش‌ها ({orders.length})
            </button>
            <button
              onClick={() => setTab("wishlist")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === "wishlist" ? "bg-saffron-500 text-ink-800" : "bg-cream-100 text-ink-500"
              }`}
            >
              علاقه‌مندی‌ها ({wishlist.length})
            </button>
          </div>

          {tab === "orders" && (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {orders.length === 0 && (
                <p className="text-ink-400 text-center py-10">هنوز سفارشی ثبت نکرده‌اید.</p>
              )}
              {orders.map((o) => (
                <div key={o.id} className="bg-cream-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-ink-400">{o.id}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[o.status] || "bg-cream-200 text-ink-500"}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-600 mb-1">{o.address}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ink-400">{o.count} قلم · {o.payMethod === "cod" ? "پرداخت در محل" : "کارت بانکی"}</span>
                    <span className="font-bold text-saffron-600">{formatToman(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {wishlist.length === 0 && (
                <p className="text-ink-400 text-center py-10 col-span-full">لیست علاقه‌مندی‌های شما خالی است.</p>
              )}
              {wishlist.map((m) => (
                <div key={m.idMeal} className="bg-cream-100 rounded-2xl overflow-hidden">
                  <Link to={`/product/${m.idMeal}`}>
                    <img src={m.strMealThumb} alt={m.strMeal} className="w-full h-24 object-cover" />
                  </Link>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-ink-700 line-clamp-1 mb-1">{m.strMeal}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-saffron-600 font-bold">{formatToman(getMealPrice(m.idMeal))}</span>
                      <button
                        onClick={() => {
                          dispatch(toggleWishlist(m));
                          notify.info("از علاقه‌مندی‌ها حذف شد");
                        }}
                        className="text-paprika-500 text-xs"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
