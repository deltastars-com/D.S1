import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TourButtonProps {
  onClick: () => void;
  className?: string;
}

export default function TourButton({ onClick, className = '' }: TourButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all ${className}`}
      title="اضغط لبدء الجولة التعريفية"
    >
      <HelpCircle className="w-5 h-5" />

      {/* Pulse Animation */}
      <motion.div
        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-purple-500 opacity-30"
      />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        جولة تعريفية
      </div>
    </motion.button>
  );
}
