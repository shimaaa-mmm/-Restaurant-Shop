import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchMeals,
  fetchCategories,
  fetchAreas,
  filterCategory,
  filterArea,
  fetchRandomMeal,
  clearRandomMeal,
} from "../features/meals/mealSlice";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { Link } from "react-router-dom";
import { getMealPrice, formatToman } from "../utils/priceUtils";
import { getMealRating } from "../utils/ratingUtils";
import { notify } from "../utils/notify";
import QuickViewModal from "../components/QuickViewModal";
import RatingStars from "../components/RatingStars";
import PromoStrip from "../components/PromoStrip";
import StatsParallax from "../components/StatsParallax";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: Math.min(i * 0.06, 0.6), ease: [0.16, 1, 0.3, 1] },
  }),
};

function MealCard({ meal, index, handleAdd, handleQuickView, isWished, onToggleWish, handlePopoverOpen, open, anchorEl, popoverMealId, handlePopoverClose }) {
  const price = getMealPrice(meal.idMeal);
  const { rating, reviews } = getMealRating(meal.idMeal);
  const popular = rating >= 4.7;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          boxShadow: "0 8px 24px -8px rgba(28,20,16,0.18)",
          transition: "box-shadow 0.4s ease",
          "&:hover": { boxShadow: "0 24px 48px -12px rgba(28,20,16,0.32)" },
          overflow: "hidden",
        }}
      >
        <div className="relative group cursor-pointer" onClick={() => handleQuickView(meal.idMeal)}>
          <CardMedia
            component="img"
            height="190"
            image={meal.strMealThumb}
            alt={meal.strMeal}
            sx={{
              transition: "transform 0.6s cubic-bezier(.16,1,.3,1)",
              "&:hover": { transform: "scale(1.08)" },
            }}
          />
          <div className="absolute inset-0 bg-ink-800/0 group-hover:bg-ink-800/30 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-white/95 text-ink-700 text-xs font-bold px-4 py-2 rounded-full shadow-md">
              <VisibilityIcon fontSize="small" /> مشاهده سریع
            </span>
          </div>

          {popular && (
            <span className="absolute top-3 left-3 bg-paprika-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              🔥 پرطرفدار
            </span>
          )}

          <span className="absolute top-3 right-3 bg-saffron-500 text-ink-800 text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {formatToman(price)}
          </span>

          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <IconButton
              aria-label="علاقه‌مندی"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish(meal);
              }}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "#fff" } }}
            >
              {isWished ? (
                <FavoriteIcon fontSize="small" sx={{ color: "#C1440E" }} />
              ) : (
                <FavoriteBorderIcon fontSize="small" sx={{ color: "#1C1410" }} />
              )}
            </IconButton>
          </div>

          <IconButton
            aria-label="بیشتر"
            onClick={(e) => {
              e.stopPropagation();
              handlePopoverOpen(e, meal.idMeal);
            }}
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "#fff" },
            }}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>

        <Popover
          open={open && popoverMealId === meal.idMeal}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <List dense>
            <ListItem button>
              <ListItemIcon><FacebookIcon sx={{ color: "#1877F2" }} /></ListItemIcon>
              <ListItemText primary="اشتراک در فیسبوک" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><TwitterIcon sx={{ color: "#1DA1F2" }} /></ListItemIcon>
              <ListItemText primary="اشتراک در توییتر" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><InstagramIcon sx={{ color: "#C13584" }} /></ListItemIcon>
              <ListItemText primary="اشتراک در اینستاگرام" />
            </ListItem>
          </List>
        </Popover>

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 className="font-bold text-ink-700 text-lg mb-1 line-clamp-2">
            {meal.strMeal}
          </h3>
          <p className="text-xs text-saffron-600 font-semibold mb-1.5">
            {meal.strCategory || meal.strArea || "غذای خانگی"}
          </p>
          <RatingStars rating={rating} reviews={reviews} size="text-xs" />
          <p className="text-sm text-ink-400 line-clamp-3 flex-1 mt-2">
            {meal.strInstructions
              ? meal.strInstructions.slice(0, 100) + "…"
              : "توضیحاتی برای این غذا ثبت نشده است."}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleAdd(meal)}
              className="flex-1 px-4 py-2 rounded-full text-sm font-bold text-ink-800 bg-saffron-500 hover:bg-saffron-400 shadow-glow transition-colors duration-300"
            >
              افزودن به سبد
            </button>
            <Link
              to={`/product/${meal.idMeal}`}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-ink-100 text-ink-600 hover:bg-ink-50 transition-colors duration-300"
            >
              جزئیات
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[20px] overflow-hidden bg-white shadow-card">
      <div className="skeleton h-[190px] w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

function MiddleParallaxDiagonal({ imageUrl, title }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative my-14 overflow-hidden h-72 md:h-80 w-full rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundPositionY: `${scrollY * 0.15}px`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-800/90 via-ink-800/40 to-transparent flex items-end justify-center pb-10">
        <h2 className="font-display text-white text-2xl md:text-4xl font-bold text-center px-4 saffron-underline">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const meals = useSelector((s) => s.meals.items);
  const categories = useSelector((s) => s.meals.categories);
  const areas = useSelector((s) => s.meals.areas);
  const status = useSelector((s) => s.meals.status);
  const errorMsg = useSelector((s) => s.meals.error);
  const randomMeal = useSelector((s) => s.meals.randomMeal);
  const randomStatus = useSelector((s) => s.meals.randomStatus);
  const auth = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.items);

  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverMealId, setPopoverMealId] = useState(null);
  const [quickViewId, setQuickViewId] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMeals());
    dispatch(fetchCategories());
    dispatch(fetchAreas());
  }, [dispatch]);

  // جستجوی زنده با تأخیر (debounce) روی API واقعی
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!selectedCategory && !selectedArea) {
        dispatch(fetchMeals(q));
      }
    }, 450);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    if (randomStatus === "succeeded" && randomMeal) {
      setQuickViewId(randomMeal.idMeal);
      setQuickViewOpen(true);
      dispatch(clearRandomMeal());
    }
  }, [randomStatus, randomMeal, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory("");
    setSelectedArea("");
    dispatch(fetchMeals(q));
  };

  const handleAdd = (item, qty = 1) => {
    if (!auth.user) {
      notify.warning("برای افزودن به سبد باید وارد شوید.");
      return;
    }
    for (let i = 0; i < qty; i++) dispatch(addToCart(item));
    notify.success(`${item.strMeal} به سبد اضافه شد`);
  };

  const handleToggleWish = (meal) => {
    dispatch(toggleWishlist(meal));
    const already = wishlist.find((w) => w.idMeal === meal.idMeal);
    notify.info(already ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد ❤️");
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSelectedArea("");
    setQ("");
    if (cat) dispatch(filterCategory(cat));
    else dispatch(fetchMeals());
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    setSelectedCategory("");
    setQ("");
    if (area) dispatch(filterArea(area));
    else dispatch(fetchMeals());
  };

  const handleRandom = () => dispatch(fetchRandomMeal());

  const handleQuickView = (id) => {
    setQuickViewId(id);
    setQuickViewOpen(true);
  };

  const handlePopoverOpen = (event, mealId) => {
    setAnchorEl(event.currentTarget);
    setPopoverMealId(mealId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverMealId(null);
  };

  const handleRetry = () => {
    if (selectedCategory) dispatch(filterCategory(selectedCategory));
    else if (selectedArea) dispatch(filterArea(selectedArea));
    else dispatch(fetchMeals(q));
  };

  const open = Boolean(anchorEl);

  return (
    <div className="w-full">
      <PromoStrip />

      <div className="px-0 md:px-2 lg:px-4 py-4">
        {/* جستجو و دسته‌بندی */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl shadow-card p-4 mt-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="جستجوی غذا… (زنده)"
              className="w-full border border-ink-100 text-right rounded-full px-4 py-2.5 pl-14 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition"
            />
            <button
              type="submit"
              className="absolute left-1 top-1 bottom-1 px-4 bg-saffron-500 text-ink-800 rounded-full hover:bg-saffron-400 transition font-semibold"
              aria-label="جستجو"
            >
              🔍
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border border-ink-100 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition bg-white text-ink-700 font-medium"
            >
              <option value="">همه دسته‌ها</option>
              {categories.map((c) => (
                <option key={c.idCategory} value={c.strCategory}>
                  {c.strCategory}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={handleAreaChange}
              className="border border-ink-100 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition bg-white text-ink-700 font-medium"
            >
              <option value="">همه کشورها</option>
              {areas.map((a) => (
                <option key={a.strArea} value={a.strArea}>
                  {a.strArea}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandom}
              disabled={randomStatus === "loading"}
              className="px-4 py-2.5 rounded-full bg-ink-800 text-cream-50 text-sm font-semibold shadow-sm hover:bg-ink-700 transition disabled:opacity-60"
            >
              {randomStatus === "loading" ? "در حال قرعه‌کشی…" : "🎲 غذای تصادفی"}
            </motion.button>
          </div>
        </div>

        {status === "failed" && (
          <div className="mb-8 bg-paprika-50 border border-paprika-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-paprika-600 text-sm font-semibold">
              ⚠️ برقراری ارتباط با سرور با مشکل مواجه شد.
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-paprika-500 text-white text-xs font-bold rounded-full hover:bg-paprika-600 transition"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {status !== "loading" && meals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🥲</p>
            <p className="text-ink-400 font-medium">غذایی با این مشخصات پیدا نشد.</p>
          </div>
        )}

        {status !== "loading" && meals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((m, i) => (
              <MealCard
                key={m.idMeal}
                meal={m}
                index={i}
                handleAdd={handleAdd}
                handleQuickView={handleQuickView}
                isWished={!!wishlist.find((w) => w.idMeal === m.idMeal)}
                onToggleWish={handleToggleWish}
                handlePopoverOpen={handlePopoverOpen}
                handlePopoverClose={handlePopoverClose}
                open={open}
                anchorEl={anchorEl}
                popoverMealId={popoverMealId}
              />
            ))}
          </div>
        )}

        {meals.length > 6 && (
          <MiddleParallaxDiagonal
            imageUrl="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80"
            title="تجربه خوشمزه‌ترین‌ها"
          />
        )}

        <StatsParallax />
        <Testimonials />
        <Newsletter />

        <QuickViewModal
          mealId={quickViewId}
          open={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
}
