import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeltaStarsLogo } from './DeltaStarsLogo';

interface SplashScreenProps {
  onComplete: () => void;
  logoPath?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, logoPath }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    try {
      onComplete();
    } catch (err) {
      console.error('Splash dismiss error:', err);
    }
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 1500);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sovereign-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 select-none bg-emerald-950"
          style={{ background: '#021a0a' }}
        >
          {/* Main Container */}
          <div className="flex flex-col items-center justify-center max-w-md w-full text-center gap-6">
            
            {/* Logo Emblem */}
            <div className="w-28 h-28 rounded-3xl bg-white p-2 shadow-2xl ring-4 ring-yellow-400 flex items-center justify-center overflow-hidden">
              <DeltaStarsLogo
                logoUrl={logoPath || '/official_logo.png'}
                onlyEmblem={true}
                fitMode="cover"
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-tajawal">
                متجر نجوم دلتا
              </h1>
              <p className="text-xs md:text-sm text-emerald-200 font-tajawal max-w-xs leading-relaxed">
                شريكك المثالي للخضروات والفواكه والتمور عالية الجودة في المملكة العربية السعودية
              </p>
            </div>

            {/* Loader Spinner */}
            <div className="flex flex-col items-center gap-3 w-full pt-4">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-yellow-300 font-bold font-tajawal animate-pulse">
                جاري تحميل المتجر السيادي والبيانات...
              </span>
            </div>

            {/* Direct Skip / Enter Button */}
            <button
              onClick={handleDismiss}
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950 font-black text-sm font-tajawal shadow-lg hover:scale-105 active:scale-95 transition-all border border-yellow-200"
            >
              ✨ دخول المتجر فوراً ✨
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
