import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ExternalLink } from 'lucide-react';
import OnboardingTour from '../components/OnboardingTour';
import { useOnboarding } from '../hooks/useOnboarding';

export default function OnboardingPage() {
  const { isTourOpen, completeTour, resetTour, openTour, closeTour } = useOnboarding();

  const features = [
    {
      icon: '💰',
      title: 'نظام الكاش باك',
      description: 'احصل على 5% كاش باك من كل عملية شراء',
      benefits: ['أرصدة تُضاف فوراً', 'استخدمها في أي وقت', 'لا حد أقصى للأرصدة'],
    },
    {
      icon: '🎟️',
      title: 'الكوبونات والعروض',
      description: 'استخدم كوبونات حصرية للحصول على خصومات إضافية',
      benefits: ['كوبونات يومية جديدة', 'خصومات تصل إلى 50%', 'عروض محدودة الوقت'],
    },
    {
      icon: '🎪',
      title: 'صالة العروض',
      description: 'اكتشف أفضل العروض والمسابقات المحدودة',
      benefits: ['عروض موسمية', 'مسابقات بجوائز', 'إعلانات حصرية'],
    },
    {
      icon: '🏆',
      title: 'نظام الامتيازات',
      description: 'احصل على مكافآت إضافية مع كل عملية',
      benefits: ['نقاط مع كل شراء', 'تحويل تلقائي لكاش باك', 'عروض حصرية'],
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'ابحث عن كوبون',
      description: 'تصفح صالة العروض واختر الكوبون المناسب لطلبك',
      icon: '🔍',
    },
    {
      number: 2,
      title: 'انسخ الكود',
      description: 'انسخ كود الكوبون بضغطة واحدة',
      icon: '📋',
    },
    {
      number: 3,
      title: 'أضف الكوبون',
      description: 'الصق الكود عند الدفع لتطبيق الخصم',
      icon: '✨',
    },
    {
      number: 4,
      title: 'استخدم الكاش باك',
      description: 'استخدم أرصدتك لتقليل السعر أكثر',
      icon: '💳',
    },
    {
      number: 5,
      title: 'احصل على مكافآت',
      description: 'احصل على 5% كاش باك على السعر النهائي',
      icon: '🎁',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Tour Component */}
      <OnboardingTour isOpen={isTourOpen} onClose={closeTour} onComplete={completeTour} />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            مرحباً بك في متجر نجوم دلتا
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-8"
          >
            اكتشف أفضل الطرق للاستفادة من الكاش باك والكوبونات والعروص الحصرية
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={openTour}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
          >
            <Play className="w-5 h-5" />
            ابدأ الجولة التعريفية
          </motion.button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">المميزات الرئيسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-purple-500 transition-all group"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-300 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 bg-purple-400 rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">كيفية الاستفادة القصوى</h2>
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Circle */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-300 text-sm">{step.description}</p>
                  </div>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 text-2xl text-purple-500">
                    ←
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">نصائح ذهبية 💡</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'تفقد صالة العروض يومياً للعروض الجديدة',
            'اشترك في التنبيهات لتلقي أفضل العروص',
            'استخدم الكوبونات قبل انتهاء صلاحيتها',
            'شارك تجربتك وقيّم المنتجات للحصول على نقاط',
            'اجمع بين الكوبونات والكاش باك للحصول على أقصى خصم',
            'تابع حسابنا على وسائل التواصل للعروض الحصرية',
          ].map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg"
            >
              <span className="text-2xl flex-shrink-0">✨</span>
              <p className="text-slate-200">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-lg mb-8 opacity-90">
            اتبع الجولة التعريفية لفهم جميع الميزات بشكل أفضل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={openTour}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:shadow-lg transition-all"
            >
              <Play className="w-4 h-4 inline mr-2" />
              ابدأ الجولة
            </motion.button>
            <motion.button
              onClick={resetTour}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              إعادة تشغيل الجولة
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>
            هل تحتاج إلى مساعدة؟{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1">
              تواصل معنا <ExternalLink className="w-4 h-4" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
