import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMealPrice, formatToman, cartTotal } from "../utils/priceUtils";
import { notify } from "../utils/notify";
import { chargeCard, detectCardBrand } from "../api/paymentService";
import { addOrder } from "../utils/orderHistory";
import Modal from "../components/Modal";

function formatCardNumber(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

export default function Checkout() {
  const cart = useSelector((s) => s.cart);
  const auth = useSelector((s) => s.auth);
  const [step, setStep] = useState(1); // 1: آدرس، 2: پرداخت
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [payMethod, setPayMethod] = useState("card"); // card | cod

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [paying, setPaying] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const total = cartTotal(cart.items);

  function handleAddressSubmit(e) {
    e.preventDefault();
    if (!address || cart.items.length === 0) {
      notify.error("لطفاً آدرس و آیتم‌های سبد خرید را وارد کنید!");
      return;
    }
    setStep(2);
  }

  async function finalizeOrder(paymentInfo) {
    const order = {
      address,
      date,
      time,
      total,
      count: cart.items.length,
      items: cart.items.map((i) => ({ name: i.strMeal, qty: i.quantity, price: getMealPrice(i.idMeal) })),
      payMethod,
      payment: paymentInfo || null,
    };
    addOrder(auth.user?.username, order);
    setLastOrder(order);
    dispatch(clearCart());
    setSuccessOpen(true);
  }

  async function handlePaySubmit(e) {
    e.preventDefault();

    if (payMethod === "cod") {
      finalizeOrder({ method: "پرداخت در محل" });
      return;
    }

    setPaying(true);
    const result = await chargeCard({ cardNumber, expiry, cvv, holder, amount: total });
    setPaying(false);

    if (!result.ok) {
      notify.error(result.error);
      return;
    }

    notify.success(`پرداخت با موفقیت انجام شد (${result.brand})`);
    finalizeOrder({ method: "کارت بانکی", brand: result.brand, refId: result.refId });
  }

  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* نشانگر مراحل */}
      <div className="flex items-center gap-3 mb-8">
        {["آدرس و زمان", "پرداخت"].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  done ? "bg-saffron-500 text-ink-800" : active ? "bg-ink-800 text-saffron-400" : "bg-cream-200 text-ink-400"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span className={`text-sm font-semibold ${active ? "text-ink-700" : "text-ink-300"}`}>{label}</span>
              {n === 1 && <span className="w-10 h-0.5 bg-ink-100 mx-2" />}
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-[28px] shadow-card p-6 md:p-12"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold mb-8 text-ink-700 text-center saffron-underline w-fit mx-auto">
                آدرس و زمان تحویل
              </h2>

              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="آدرس دقیق (شهر، خیابان، کوچه)"
                  className="border text-right border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                  required
                />

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="flex-1 border border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                    required
                  />
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    type="time"
                    className="flex-1 border border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                    required
                  />
                </div>

                <div className="bg-cream-100 p-6 rounded-2xl border border-ink-100/60">
                  <h4 className="font-bold mb-3 text-ink-700 text-right text-lg">سفارش‌ها</h4>
                  {cart.items.length > 0 ? (
                    <ul className="space-y-2">
                      {cart.items.map((i) => (
                        <li key={i.idMeal} className="flex justify-between text-ink-600 text-sm">
                          <span>{i.strMeal} × {i.quantity}</span>
                          <span className="font-semibold">{formatToman(getMealPrice(i.idMeal) * i.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-ink-400">سبد خرید شما خالی است</p>
                  )}
                  <div className="flex justify-between mt-4 pt-4 border-t border-ink-100 font-bold text-ink-700">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-saffron-600">{formatToman(total)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="mt-2 px-8 py-4 bg-saffron-500 text-ink-800 font-bold rounded-2xl shadow-glow hover:bg-saffron-400 transition-colors"
                >
                  ادامه به پرداخت ←
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold mb-8 text-ink-700 text-center saffron-underline w-fit mx-auto">
                روش پرداخت
              </h2>

              <div className="flex gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setPayMethod("card")}
                  className={`flex-1 px-4 py-4 rounded-2xl border-2 font-semibold transition-colors ${
                    payMethod === "card" ? "border-saffron-500 bg-saffron-50 text-saffron-700" : "border-ink-100 text-ink-500"
                  }`}
                >
                  💳 کارت بانکی
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("cod")}
                  className={`flex-1 px-4 py-4 rounded-2xl border-2 font-semibold transition-colors ${
                    payMethod === "cod" ? "border-saffron-500 bg-saffron-50 text-saffron-700" : "border-ink-100 text-ink-500"
                  }`}
                >
                  💵 پرداخت در محل
                </button>
              </div>

              <form onSubmit={handlePaySubmit} className="flex flex-col gap-5">
                {payMethod === "card" && (
                  <>
                    <div className="relative">
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="شماره کارت (مثلاً 6037 9911 1234 5678)"
                        inputMode="numeric"
                        dir="ltr"
                        className="w-full text-center tracking-widest border border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                        required
                      />
                      {cardNumber.replace(/\D/g, "").length >= 6 && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-saffron-600">
                          {detectCardBrand(cardNumber)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        dir="ltr"
                        className="flex-1 text-center border border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                        required
                      />
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="CVV2"
                        dir="ltr"
                        className="flex-1 text-center border border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                        required
                      />
                    </div>

                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="نام صاحب کارت"
                      className="border text-right border-ink-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-saffron-200 transition"
                      required
                    />
                    <p className="text-[11px] text-ink-300 text-center -mt-1">
                      🔒 اطلاعات کارت شما رمزنگاری‌شده و امن است — این یک محیط دمو برای نمایش رزومه است.
                    </p>
                  </>
                )}

                {payMethod === "cod" && (
                  <div className="bg-cream-100 rounded-2xl p-6 text-center text-ink-500 text-sm">
                    مبلغ سفارش هنگام تحویل از شما دریافت می‌شود.
                  </div>
                )}

                <div className="flex justify-between items-center bg-cream-100 rounded-2xl px-6 py-4">
                  <span className="text-ink-500 font-medium">مبلغ قابل پرداخت</span>
                  <span className="text-xl font-bold text-saffron-600">{formatToman(total)}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-2xl bg-cream-200 text-ink-600 font-semibold hover:bg-cream-200/70 transition"
                  >
                    بازگشت
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={paying}
                    className="flex-1 px-8 py-4 bg-saffron-500 text-ink-800 font-bold rounded-2xl shadow-glow hover:bg-saffron-400 transition-colors disabled:opacity-60"
                  >
                    {paying ? "در حال اتصال به درگاه…" : payMethod === "cod" ? "ثبت سفارش" : `پرداخت ${formatToman(total)}`}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Modal open={successOpen} onClose={() => { setSuccessOpen(false); nav("/"); }} maxWidth="max-w-sm">
        <div className="p-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="w-20 h-20 rounded-full bg-saffron-500 text-ink-800 flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow"
          >
            ✓
          </motion.div>
          <h3 className="font-display text-2xl font-bold text-ink-700 mb-2">سفارش ثبت شد!</h3>
          {lastOrder && (
            <>
              <p className="text-ink-400 text-sm mb-3">
                {lastOrder.count} قلم به مبلغ {formatToman(lastOrder.total)} به آدرس شما ارسال می‌شود.
              </p>
              {lastOrder.payment?.refId && (
                <p className="text-xs text-ink-300 mb-6">کد پیگیری تراکنش: {lastOrder.payment.refId}</p>
              )}
            </>
          )}
          <button
            onClick={() => { setSuccessOpen(false); nav("/dashboard"); }}
            className="w-full px-6 py-3 bg-saffron-500 text-ink-800 font-bold rounded-full shadow-glow hover:bg-saffron-400 transition-colors"
          >
            مشاهده سفارش‌ها در داشبورد
          </button>
        </div>
      </Modal>
    </div>
  );
}
