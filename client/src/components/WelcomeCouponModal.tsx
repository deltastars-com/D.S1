import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Gift, Zap, ArrowRight } from 'lucide-react';

interface WelcomeCouponModalProps {
  isOpen: boolean;
  couponCode: string;
  discount: number;
  minOrderAmount: number;
  expiresAt: Date;
  onClose: () => void;
  onCopyCode: () => void;
}

export default function WelcomeCouponModal({
  isOpen,
  couponCode,
  discount,
  minOrderAmount,
  expiresAt,
  onClose,
  onCopyCode,
}: WelcomeCouponModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysRemaining = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-8 text-white">
              {/* Animated background */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"
              />

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">مبروك!</h2>
                <p className="text-sm opacity-90">لقد حصلت على كود ترحيب حصري</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Coupon Code Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-2 border-dashed border-purple-300 dark:border-purple-500 rounded-xl p-6 mb-6 text-center"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  كود الخصم
                </p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <code className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                    {couponCode}
                  </code>
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </motion.button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {copied ? 'تم النسخ!' : 'اضغط لنسخ الكود'}
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-6"
              >
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-slate-800 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {discount}% خصم
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      على أول طلب لك
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-slate-800 rounded-lg">
                  <Gift className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      حد أدنى {minOrderAmount} ريال
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      لاستخدام الكود
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-slate-800 rounded-lg">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      ينتهي في {daysRemaining} يوم
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      استخدمه قبل انتهاء الصلاحية
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg p-4 mb-6"
              >
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  💡 نصيحة:
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  يمكنك استخدام هذا الكود مع الكاش باك من محفظتك للحصول على خصم أكبر!
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'تم النسخ بنجاح!' : 'نسخ الكود'}
                </motion.button>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  ابدأ التسوق الآن
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Footer */}
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                الكود صالح لاستخدام واحد فقط
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
