import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchCategories } from "./features/meals/mealSlice";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HeroCarousel from "./components/HeroCarousel";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const hasHero = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <Header />
      <ScrollToTop />

      {hasHero && <HeroCarousel />}

      <main
        className={`w-full flex-1 flex justify-center relative z-10 px-4 ${
          hasHero ? "-mt-8 pb-16" : "pt-28 pb-16"
        }`}
      >
        <div className="w-full container mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><ProductsPage /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route
                path="/checkout"
                element={
                  <PageTransition>
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  </PageTransition>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PageTransition>
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  </PageTransition>
                }
              />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
