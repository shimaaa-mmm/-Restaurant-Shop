import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, incrementQty, decrementQty } from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMealPrice, formatToman, cartTotal } from "../utils/priceUtils";
import { notify } from "../utils/notify";
import ConfirmModal from "../components/ConfirmModal";
import { useState } from "react";

export default function CartPage() {
  const cart = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const total = cartTotal(cart.items);

  function handleCheckout() {
    if (cart.items.length === 0) {
      notify.warning("سبد خرید شما خالی است.");
      return;
    }
    nav("/checkout");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-[28px] shadow-card p-6 md:p-10"
    >
      <h2 className="font-display text-3xl font-bold text-center text-ink-700 mb-8 saffron-underline w-fit mx-auto">
        🛒 سبد خرید
      </h2>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🍽️</p>
          <p className="text-ink-400 text-lg mb-6">سبد خرید شما خالی است</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors"
          >
            مشاهده منو
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence>
              {cart.items.map((i) => {
                const price = getMealPrice(i.idMeal);
                return (
                  <motion.div
                    key={i.idMeal}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-cream-100 p-3 rounded-2xl flex items-center gap-4 border border-ink-100/50"
                  >
                    <img
                      src={i.strMealThumb}
                      alt={i.strMeal}
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink-700 truncate">{i.strMeal}</h3>
                      <p className="text-saffron-600 text-sm font-bold">{formatToman(price)}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-full px-1.5 py-1 border border-ink-100">
                      <button
                        onClick={() => dispatch(decrementQty(i.idMeal))}
                        className="w-7 h-7 rounded-full hover:bg-cream-200 font-bold text-ink-600"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{i.quantity}</span>
                      <button
                        onClick={() => dispatch(incrementQty(i.idMeal))}
                        className="w-7 h-7 rounded-full hover:bg-cream-200 font-bold text-ink-600"
                      >
                        +
                      </button>
                    </div>

                    <p className="hidden sm:block w-24 text-left font-bold text-ink-700 text-sm">
                      {formatToman(price * i.quantity)}
                    </p>

                    <button
                      onClick={() => dispatch(removeFromCart(i.idMeal))}
                      className="px-3 py-1.5 bg-paprika-500 text-white rounded-full text-xs font-semibold hover:bg-paprika-600 transition"
                    >
                      حذف
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100">
            <span className="text-ink-400 font-medium">جمع کل</span>
            <span className="text-2xl font-bold text-ink-700">{formatToman(total)}</span>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="px-5 py-3 bg-cream-200 text-ink-600 rounded-full text-sm font-semibold hover:bg-cream-200/70 transition"
            >
              پاک کردن سبد
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              className="flex-1 max-w-xs px-5 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors"
            >
              ادامه خرید ←
            </motion.button>
          </div>
        </>
      )}

      <ConfirmModal
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          dispatch(clearCart());
          notify.info("سبد خرید پاک شد");
        }}
        title="پاک کردن سبد خرید؟"
        message="همه‌ی آیتم‌های سبد خرید شما حذف می‌شوند. این کار قابل بازگشت نیست."
        confirmLabel="بله، پاک کن"
        danger
      />
    </motion.div>
  );
}
