import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Zap,
  TrendingUp,
  Gift,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  longDescription: string;
  image?: string;
  category: string;
  stock: number;
  cashbackPercentage?: number;
  discount?: number;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

interface ProductDetailsProps {
  product?: Product;
  onAddToCart?: (quantity: number) => void;
  onAddToWishlist?: () => void;
  params?: any;
}

const CASHBACK_RATE = 0.05; // 5% default cashback

export default function ProductDetails({
  product = {
    id: '1',
    name: 'منتج فاخر عالي الجودة',
    price: 299.99,
    rating: 4.8,
    reviews: 245,
    description: 'منتج عالي الجودة مع ضمان شامل',
    longDescription:
      'هذا المنتج يوفر أفضل قيمة مقابل المال مع ميزات متقدمة وتصميم عصري. يأتي مع ضمان شامل لمدة سنتين وخدمة عملاء 24/7.',
    category: 'إلكترونيات',
    stock: 45,
    cashbackPercentage: 5,
    discount: 15,
    tags: ['الأكثر مبيعاً', 'جديد', 'موصى به'],
    features: [
      'جودة عالية الدقة',
      'تصميم عصري أنيق',
      'سهل الاستخدام',
      'ضمان شامل',
      'خدمة عملاء متميزة',
    ],
    specifications: {
      الوزن: '500 غرام',
      الحجم: '25 × 15 × 10 سم',
      المادة: 'ألومنيوم وبلاستيك عالي الجودة',
      الضمان: 'سنتان',
    },
  },
  onAddToCart,
  onAddToWishlist,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Calculate prices and cashback
  const cashbackRate = product.cashbackPercentage || CASHBACK_RATE;
  const discountAmount = product.discount ? (product.price * product.discount) / 100 : 0;
  const finalPrice = product.price - discountAmount;
  const expectedCashback = finalPrice * cashbackRate * quantity;
  const totalPrice = finalPrice * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(quantity);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <ShoppingCart className="w-32 h-32 text-purple-500 opacity-20" />
              </div>

              {/* Discount Badge */}
              {product.discount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg"
                >
                  -{product.discount}%
                </motion.div>
              )}

              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.tags?.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600 dark:text-slate-400">
                  {product.rating} ({product.reviews} تقييم)
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-purple-200 dark:border-purple-700">
              <div className="space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {finalPrice.toFixed(2)} ر.س
                  </span>
                  {product.discount && (
                    <span className="text-xl text-slate-500 line-through">
                      {product.price.toFixed(2)} ر.س
                    </span>
                  )}
                </div>

                {/* Cashback Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        كاش باك متوقع
                      </span>
                    </div>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300">
                        لكل وحدة:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {(finalPrice * cashbackRate).toFixed(2)} ر.س
                      </span>
                    </div>

                    {quantity > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-700"
                      >
                        <span className="text-slate-700 dark:text-slate-300">
                          إجمالي ({quantity} وحدة):
                        </span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {expectedCashback.toFixed(2)} ر.س
                        </span>
                      </motion.div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                      ✓ سيُضاف الكاش باك تلقائياً بعد تأكيد الطلب
                    </p>
                  </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center">
                    <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600 dark:text-slate-400">شحن مجاني</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600 dark:text-slate-400">ضمان 2 سنة</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600 dark:text-slate-400">توصيل سريع</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  الكمية:
                </span>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ({product.stock} متاح)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  أضف إلى السلة
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWishlist}
                  className={`p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isWishlisted
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'مضاف للمفضلة' : 'أضف للمفضلة'}
                </motion.button>
              </div>

              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-5 h-5" />
                شارك المنتج
              </motion.button>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                وصف المنتج
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {product.longDescription}
              </p>
            </Card>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  المميزات الرئيسية
                </h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  المواصفات
                </h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
                    >
                      <span className="text-slate-600 dark:text-slate-400">{key}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
