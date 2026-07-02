import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, History, Send, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CashbackData {
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  usedTotal: number;
  lastUpdated: Date;
  nextWithdrawalDate?: Date;
}

interface CashbackTransaction {
  id: string;
  type: 'earned' | 'used' | 'withdrawn';
  amount: number;
  description: string;
  date: Date;
  orderId?: string;
}

interface CashbackBalanceProps {
  data?: CashbackData;
  transactions?: CashbackTransaction[];
  onWithdraw?: () => void;
  onUseInCheckout?: () => void;
}

export default function CashbackBalance({
  data = {
    totalEarned: 450,
    availableBalance: 150,
    pendingBalance: 75,
    usedTotal: 225,
    lastUpdated: new Date(),
    nextWithdrawalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  transactions = [
    {
      id: '1',
      type: 'earned',
      amount: 50,
      description: 'طلب رقم #12345 - كاش باك 5%',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderId: '12345',
    },
    {
      id: '2',
      type: 'used',
      amount: 30,
      description: 'استخدام في طلب رقم #12346',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      orderId: '12346',
    },
  ],
  onWithdraw,
  onUseInCheckout,
}: CashbackBalanceProps) {
  const [showTransactions, setShowTransactions] = useState(false);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return '📈';
      case 'used':
        return '💳';
      case 'withdrawn':
        return '💸';
      default:
        return '📝';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'used':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'withdrawn':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'earned':
        return 'كاش باك مكتسب';
      case 'used':
        return 'كاش باك مستخدم';
      case 'withdrawn':
        return 'كاش باك مسحوب';
      default:
        return 'عملية';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-700">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                  💰
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    رصيد الكاش باك
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    آخر تحديث: {data.lastUpdated.toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
              <Wallet className="w-8 h-8 text-purple-500 opacity-50" />
            </div>

            {/* Main Balance Display */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                الرصيد المتاح للاستخدام
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                  {data.availableBalance.toFixed(2)}
                </span>
                <span className="text-2xl text-slate-600 dark:text-slate-400">ر.س</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  إجمالي المكتسب
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {data.totalEarned.toFixed(2)} ر.س
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  قيد الانتظار
                </p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {data.pendingBalance.toFixed(2)} ر.س
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  المستخدم
                </p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {data.usedTotal.toFixed(2)} ر.س
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUseInCheckout}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                استخدم في الدفع
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onWithdraw}
                disabled={data.availableBalance < 50}
                className="p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                سحب الرصيد
              </motion.button>
            </div>

            {/* Info Message */}
            {data.availableBalance < 50 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-semibold">
                  ℹ️ الحد الأدنى للسحب 50 ريال
                </span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* How to Earn Cashback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            كيفية كسب الكاش باك
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                احصل على 5% كاش باك من كل عملية شراء
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                الكاش باك يُضاف تلقائياً بعد تأكيد الطلب
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                استخدم الكاش باك كخصم مباشر في الطلبات القادمة
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Transactions History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              السجل الأخير
            </h3>
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
            >
              {showTransactions ? 'إخفاء' : 'عرض الكل'}
            </button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, showTransactions ? transactions.length : 3).map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between ${getTransactionColor(
                  tx.type
                )}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {getTransactionLabel(tx.type)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {tx.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      tx.type === 'earned'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'earned' ? '+' : '-'}{tx.amount.toFixed(2)} ر.س
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tx.date.toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                لا توجد عمليات كاش باك حتى الآن
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
