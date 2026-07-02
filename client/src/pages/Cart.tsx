import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Wallet,
  Gift,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface CartProps {
  items?: CartItem[];
  cashbackBalance?: number;
  onCheckout?: (items: CartItem[], discount: number) => void;
  params?: any;
}

export default function Cart({
  items = [
    {
      id: '1',
      name: 'منتج 1',
      price: 99.99,
      quantity: 2,
      description: 'وصف المنتج',
    },
    {
      id: '2',
      name: 'منتج 2',
      price: 49.99,
      quantity: 1,
      description: 'وصف المنتج',
    },
  ],
  cashbackBalance = 150,
  onCheckout,
}: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [useCashback, setUseCashback] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Calculate totals
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const tax = subtotal * 0.15; // 15% VAT
  const cashbackDiscount = useCashback ? Math.min(cashbackAmount, cashbackBalance) : 0;
  const total = subtotal + tax - cashbackDiscount;

  // Handle quantity changes
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  // Remove item
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Toggle cashback
  const toggleCashback = () => {
    if (!useCashback) {
      setCashbackAmount(Math.min(subtotal, cashbackBalance));
      setUseCashback(true);
    } else {
      setUseCashback(false);
      setCashbackAmount(0);
    }
  };

  // Update cashback amount
  const updateCashbackAmount = (amount: number) => {
    const maxAmount = Math.min(subtotal, cashbackBalance);
    setCashbackAmount(Math.min(amount, maxAmount));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              سلة المشتريات فارغة
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              أضف بعض المنتجات لبدء التسوق
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              العودة للمتجر
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          سلة المشتريات
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-8 h-8 text-purple-500 opacity-50" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {item.price.toFixed(2)} ر.س
                        </p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>

                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <p className="font-bold text-slate-900 dark:text-white">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                ملخص الطلب
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>السعر الأساسي</span>
                  <span>{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>الضريبة (15%)</span>
                  <span>{tax.toFixed(2)} ر.س</span>
                </div>
                {cashbackDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>خصم الكاش باك</span>
                    <span>-{cashbackDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  الإجمالي
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {total.toFixed(2)} ر.س
                </p>
              </div>

              {/* Cashback Section */}
              {cashbackBalance > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        الكاش باك المتاح
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {cashbackBalance.toFixed(2)} ر.س
                    </span>
                  </div>

                  {useCashback ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max={Math.min(subtotal, cashbackBalance)}
                          step="10"
                          value={cashbackAmount}
                          onChange={(e) => updateCashbackAmount(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          value={cashbackAmount.toFixed(2)}
                          onChange={(e) => updateCashbackAmount(parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleCashback}
                        className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        تطبيق الخصم
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleCashback}
                      className="w-full p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Gift className="w-4 h-4" />
                      استخدم الكاش باك
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCheckout?.(cartItems, cashbackDiscount)}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
                متابعة الدفع
              </motion.button>

              {/* Info */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
                ✓ شحن مجاني للطلبات فوق 100 ريال
                <br />
                ✓ ضمان استرجاع المال خلال 30 يوم
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
