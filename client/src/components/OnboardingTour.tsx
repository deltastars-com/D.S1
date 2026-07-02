import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, CheckCircle, Zap } from 'lucide-react';
import WelcomeCouponModal from './WelcomeCouponModal';
import { useAuth } from '@/_core/hooks/useAuth';

interface TourStep {
  id: string;
  title: string;
  description: string;
  tips: string[];
  target?: string;
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'مرحباً بك في متجر نجوم دلتا! 🌟',
    description: 'سنأخذك في جولة سريعة لتتعرف على أفضل الميزات والعروض الخاصة بك',
    tips: [
      'تعرف على نظام الكاش باك والحصول على أرصدة مع كل عملية شراء',
      'استخدم الكوبونات والعروص الخاصة للحصول على خصومات إضافية',
      'اكتشف صالة العروض الترويجية للعروض المحدودة والحصرية',
    ],
  },
  {
    id: 'cashback',
    title: 'نظام الكاش باك 💰',
    description: 'احصل على نسبة من كل عملية شراء كأرصدة في محفظتك',
    tips: [
      'كل عملية شراء تعطيك 5% كاش باك تلقائياً',
      'الأرصدة تُضاف فوراً إلى محفظتك',
      'استخدم الأرصدة في أي وقت لتقليل سعر طلبك',
      'لا توجد حد أقصى للأرصدة المتراكمة',
    ],
  },
  {
    id: 'wallet',
    title: 'محفظتك الشخصية 👛',
    description: 'تابع رصيدك وعملياتك المالية بسهولة',
    tips: [
      'شاهد رصيدك المتاح والمكتسب والمستخدم',
      'راجع سجل جميع عملياتك المالية',
      'اسحب أرصدتك في أي وقت إلى حسابك البنكي',
      'احصل على إشعارات فورية بكل عملية',
    ],
  },
  {
    id: 'coupons',
    title: 'الكوبونات والعروض 🎟️',
    description: 'استخدم الكوبونات الحصرية للحصول على خصومات إضافية',
    tips: [
      'كل كوبون له شروط معينة (حد أدنى للطلب، عدد استخدامات)',
      'انسخ كود الكوبون بضغطة واحدة',
      'استخدم الكوبون عند الدفع لتطبيق الخصم تلقائياً',
      'بعض الكوبونات حصرية للعملاء الجدد فقط',
    ],
  },
  {
    id: 'promotions',
    title: 'صالة العروض الترويجية 🎪',
    description: 'اكتشف أفضل العروض والمسابقات المحدودة',
    tips: [
      'عروض موسمية بخصومات تصل إلى 50%',
      'مسابقات يومية وأسبوعية بجوائز مجزية',
      'إعلانات خاصة عن المنتجات الجديدة',
      'عروض محدودة الوقت - لا تفوتها!',
    ],
  },
  {
    id: 'strategy',
    title: 'استراتيجية التسوق الذكية 🎯',
    description: 'كيفية الاستفادة القصوى من جميع الميزات معاً',
    tips: [
      '1️⃣ ابدأ بالبحث عن كوبون مناسب لطلبك',
      '2️⃣ استخدم الكوبون عند الدفع للحصول على خصم فوري',
      '3️⃣ استخدم الكاش باك من محفظتك لتقليل السعر أكثر',
      '4️⃣ احصل على 5% كاش باك على السعر النهائي',
      '5️⃣ تابع صالة العروض للعروض الحصرية التالية',
    ],
  },
  {
    id: 'rewards',
    title: 'نظام الامتيازات 🏆',
    description: 'احصل على مكافآت إضافية بكل عملية',
    tips: [
      'كل 5 عمليات شراء = 100 نقطة إضافية',
      'النقاط تُحول تلقائياً إلى كاش باك',
      'العملاء المميزون يحصلون على عروض حصرية',
      'شارك أصدقاءك واحصل على مكافآت إحالة',
    ],
  },
  {
    id: 'tips',
    title: 'نصائح ذهبية 💡',
    description: 'اتبع هذه النصائح للحصول على أقصى فائدة',
    tips: [
      '✨ تفقد صالة العروض يومياً للعروض الجديدة',
      '✨ اشترك في التنبيهات لتلقي أفضل العروض',
      '✨ استخدم الكوبونات قبل انتهاء صلاحيتها',
      '✨ شارك تجربتك وقيّم المنتجات للحصول على نقاط إضافية',
      '✨ تابع حسابنا على وسائل التواصل للعروص الحصرية',
    ],
  },
  {
    id: 'complete',
    title: 'مبروك! 🎉',
    description: 'لقد أكملت الجولة التعريفية بنجاح',
    tips: [
      'أنت الآن جاهز للاستمتاع بجميع الميزات',
      'ابدأ التسوق الآن واحصل على أفضل العروض',
      'لا تتردد في الرجوع للجولة في أي وقت',
      'شكراً لاختيارك متجر نجوم دلتا! 🌟',
    ],
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface WelcomeCoupon {
  code: string;
  discount: number;
  minOrderAmount: number;
  expiresAt: Date;
}

export default function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [welcomeCoupon, setWelcomeCoupon] = useState<WelcomeCoupon | null>(null);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCompletedSteps([...completedSteps, step.id]);
      setCurrentStep(currentStep + 1);
    } else {
      // Generate welcome coupon
      const couponCode = `WELCOME${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      setWelcomeCoupon({
        code: couponCode,
        discount: 20,
        minOrderAmount: 50,
        expiresAt,
      });
      
      setShowCouponModal(true);
      onClose();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const handleCopyCoupon = () => {
    if (welcomeCoupon) {
      navigator.clipboard.writeText(welcomeCoupon.code);
    }
  };

  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
  };

  return (
    <>
      <WelcomeCouponModal
        isOpen={showCouponModal}
        couponCode={welcomeCoupon?.code || ''}
        discount={welcomeCoupon?.discount || 20}
        minOrderAmount={welcomeCoupon?.minOrderAmount || 50}
        expiresAt={welcomeCoupon?.expiresAt || new Date()}
        onClose={handleCloseCouponModal}
        onCopyCode={handleCopyCoupon}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                <p className="text-sm opacity-90">{step.description}</p>
              </div>
              <button
                onClick={handleSkip}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Tips */}
              <div className="space-y-4 mb-8">
                {step.tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-purple-200 dark:border-slate-600"
                  >
                    <div className="flex-shrink-0">
                      <Zap className="w-5 h-5 text-purple-500 mt-1" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200">{tip}</p>
                  </motion.div>
                ))}
              </div>

              {/* Step Indicators */}
              <div className="mb-8">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  الخطوة {currentStep + 1} من {tourSteps.length}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {tourSteps.map((s, index) => (
                    <motion.button
                      key={s.id}
                      onClick={() => handleStepClick(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                          : completedSteps.includes(s.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {completedSteps.includes(s.id) ? (
                        <CheckCircle className="w-5 h-5 mx-auto" />
                      ) : (
                        index + 1
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="mb-8 p-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-800 dark:to-slate-700 rounded-xl text-center">
                <div className="text-6xl mb-4">
                  {step.id === 'welcome' && '🎯'}
                  {step.id === 'cashback' && '💰'}
                  {step.id === 'wallet' && '👛'}
                  {step.id === 'coupons' && '🎟️'}
                  {step.id === 'promotions' && '🎪'}
                  {step.id === 'strategy' && '🎯'}
                  {step.id === 'rewards' && '🏆'}
                  {step.id === 'tips' && '💡'}
                  {step.id === 'complete' && '🎉'}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {step.id === 'welcome' && 'استعد لاكتشاف عالم من الفرص والعروص الحصرية'}
                  {step.id === 'cashback' && 'احصل على أرصدة مع كل عملية شراء'}
                  {step.id === 'wallet' && 'أدر أموالك بسهولة وأمان'}
                  {step.id === 'coupons' && 'استمتع بخصومات إضافية'}
                  {step.id === 'promotions' && 'لا تفوت أفضل العروص'}
                  {step.id === 'strategy' && 'اجمع بين الميزات للحصول على أقصى فائدة'}
                  {step.id === 'rewards' && 'كل عملية تعطيك مكافآت إضافية'}
                  {step.id === 'tips' && 'اتبع هذه النصائح للاستفادة القصوى'}
                  {step.id === 'complete' && 'أنت الآن جاهز للبدء!'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-6 flex justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                السابق
              </button>

              <button
                onClick={handleSkip}
                className="px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                تخطي الجولة
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
              >
                {currentStep === tourSteps.length - 1 ? 'إنهاء' : 'التالي'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
