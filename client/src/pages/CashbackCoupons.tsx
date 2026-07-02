import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Ticket, Wallet, TrendingUp, Copy, Check } from 'lucide-react';

export default function CashbackCoupons() {
  const [activeTab, setActiveTab] = useState('cashback');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const userWallet = {
    balance: 2500,
    totalEarned: 15000,
    totalUsed: 12500,
  };

  const cashbackTransactions = [
    {
      id: 1,
      date: '2026-07-01',
      amount: 150,
      type: 'earned',
      description: 'كاش باك من طلب #ORD-1001',
      percentage: 5,
    },
    {
      id: 2,
      date: '2026-06-30',
      amount: 200,
      type: 'earned',
      description: 'كاش باك من طلب #ORD-1000',
      percentage: 5,
    },
    {
      id: 3,
      date: '2026-06-29',
      amount: 500,
      type: 'used',
      description: 'استخدام الكاش باك في الطلب #ORD-999',
      percentage: 0,
    },
  ];

  const coupons = [
    {
      id: 'SUMMER50',
      code: 'SUMMER50',
      description: 'خصم 50 ريال على جميع الطلبات',
      discount: 50,
      type: 'fixed',
      minOrder: 100,
      expiryDate: '2026-08-31',
      usageCount: 1,
      maxUsage: 5,
      active: true,
    },
    {
      id: 'WELCOME20',
      code: 'WELCOME20',
      description: 'خصم 20% على أول طلب',
      discount: 20,
      type: 'percentage',
      minOrder: 50,
      expiryDate: '2026-12-31',
      usageCount: 0,
      maxUsage: 1,
      active: true,
    },
    {
      id: 'FRIEND100',
      code: 'FRIEND100',
      description: 'أحضر صديقك واحصل على 100 ريال',
      discount: 100,
      type: 'referral',
      minOrder: 0,
      expiryDate: '2026-09-30',
      usageCount: 3,
      maxUsage: 10,
      active: true,
    },
    {
      id: 'EXPIRED30',
      code: 'EXPIRED30',
      description: 'خصم 30 ريال (منتهي الصلاحية)',
      discount: 30,
      type: 'fixed',
      minOrder: 75,
      expiryDate: '2026-06-30',
      usageCount: 2,
      maxUsage: 5,
      active: false,
    },
  ];

  const promotions = [
    {
      id: 1,
      title: 'عرض نهاية الأسبوع',
      description: 'احصل على خصم إضافي 10% على جميع الطلبات يوم الجمعة والسبت',
      discount: '10%',
      validFrom: '2026-07-05',
      validTo: '2026-07-06',
      badge: 'نشط',
    },
    {
      id: 2,
      title: 'عرض الشهر الكريم',
      description: 'خصم 25% على جميع الطلبات طوال الشهر',
      discount: '25%',
      validFrom: '2026-03-01',
      validTo: '2026-03-30',
      badge: 'منتهي',
    },
    {
      id: 3,
      title: 'عرض العملاء الجدد',
      description: 'احصل على 100 ريال كاش باك على أول 3 طلبات',
      discount: '100 ر.س',
      validFrom: '2026-07-01',
      validTo: '2026-08-31',
      badge: 'نشط',
    },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            الكاش باك والكوبونات
          </h1>
          <p className="text-slate-400 text-sm mt-1">إدارة أرصدتك والعروض الخاصة بك</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-90 mb-2">الرصيد المتاح</p>
                <p className="text-3xl font-bold">{userWallet.balance} ر.س</p>
              </div>
              <Wallet className="w-8 h-8 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-90 mb-2">إجمالي المكتسب</p>
                <p className="text-3xl font-bold">{userWallet.totalEarned} ر.س</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-90 mb-2">إجمالي المستخدم</p>
                <p className="text-3xl font-bold">{userWallet.totalUsed} ر.س</p>
              </div>
              <Gift className="w-8 h-8 opacity-50" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'cashback', label: 'الكاش باك', icon: Wallet },
            { id: 'coupons', label: 'الكوبونات', icon: Ticket },
            { id: 'promotions', label: 'العروض', icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cashback Tab */}
        {activeTab === 'cashback' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700 border-b border-slate-600">
                      <th className="px-6 py-4 text-right text-sm font-semibold">التاريخ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الوصف</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">النسبة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">المبلغ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">النوع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashbackTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">{transaction.date}</td>
                        <td className="px-6 py-4 text-sm">{transaction.description}</td>
                        <td className="px-6 py-4 text-sm">
                          {transaction.percentage > 0 ? `${transaction.percentage}%` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-400">
                          {transaction.amount} ر.س
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${
                              transaction.type === 'earned'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {transaction.type === 'earned' ? 'مكتسب' : 'مستخدم'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-slate-800 rounded-lg border ${
                  coupon.active ? 'border-slate-700' : 'border-slate-600 opacity-60'
                } p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{coupon.description}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {coupon.type === 'fixed' && `خصم ${coupon.discount} ريال`}
                      {coupon.type === 'percentage' && `خصم ${coupon.discount}%`}
                      {coupon.type === 'referral' && `${coupon.discount} ريال عند الإحالة`}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${
                      coupon.active
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {coupon.active ? 'نشط' : 'منتهي'}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الحد الأدنى للطلب:</span>
                    <span>{coupon.minOrder === 0 ? 'بدون حد' : `${coupon.minOrder} ر.س`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاريخ الانتهاء:</span>
                    <span>{coupon.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">الاستخدام:</span>
                    <span>
                      {coupon.usageCount}/{coupon.maxUsage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-700 rounded mb-4">
                  <code className="flex-1 font-mono text-sm">{coupon.code}</code>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {coupon.active && coupon.usageCount < coupon.maxUsage && (
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded transition-colors">
                    استخدام الكوبون
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{promo.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">{promo.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400 mb-2">{promo.discount}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${
                        promo.badge === 'نشط'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}
                    >
                      {promo.badge}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-slate-400">
                  <span>من {promo.validFrom}</span>
                  <span>إلى {promo.validTo}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
