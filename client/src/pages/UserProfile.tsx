import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Gift,
  Ticket,
  Clock,
  CheckCircle,
  Copy,
  Calendar,
  Zap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserCoupon {
  id: string;
  code: string;
  type: 'welcome' | 'seasonal' | 'referral' | 'loyalty';
  discountPercentage: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

interface RewardStats {
  totalCoupons: number;
  activeCoupons: number;
  usedCoupons: number;
  totalSavings: number;
}

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  // Mock data - في الإنتاج ستأتي من API
  const mockCoupons: UserCoupon[] = [
    {
      id: '1',
      code: 'WELCOME123456789',
      type: 'welcome',
      discountPercentage: 20,
      minOrderAmount: 50,
      maxUses: 1,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'كود ترحيب حصري - 20% خصم على أول طلب',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      code: 'SUMMER50',
      type: 'seasonal',
      discountPercentage: 50,
      minOrderAmount: 100,
      maxUses: 5,
      usedCount: 2,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: 'عرض صيفي - 50% خصم',
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const rewardStats: RewardStats = {
    totalCoupons: mockCoupons.length,
    activeCoupons: mockCoupons.filter((c) => c.isActive).length,
    usedCoupons: mockCoupons.reduce((sum, c) => sum + c.usedCount, 0),
    totalSavings: 450,
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const days = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCouponTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      welcome: 'كود ترحيب',
      seasonal: 'عرض موسمي',
      referral: 'كود إحالة',
      loyalty: 'كود ولاء',
    };
    return labels[type] || type;
  };

  const getCouponTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      welcome: 'from-purple-500 to-pink-500',
      seasonal: 'from-orange-500 to-red-500',
      referral: 'from-green-500 to-emerald-500',
      loyalty: 'from-blue-500 to-cyan-500',
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name || 'المستخدم'}</h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {['overview', 'rewards', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'overview' && 'نظرة عامة'}
                {tab === 'rewards' && 'مكافآتي'}
                {tab === 'history' && 'السجل'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 border-purple-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">إجمالي الكوبونات</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {rewardStats.totalCoupons}
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700 border-green-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">كوبونات نشطة</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {rewardStats.activeCoupons}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">مستخدمة</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {rewardStats.usedCoupons}
                    </p>
                  </div>
                  <Ticket className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 border-orange-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">إجمالي التوفير</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {rewardStats.totalSavings} ر.س
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
                </div>
              </Card>
            </div>

            {/* Recent Coupons */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                آخر الكوبونات
              </h2>
              <div className="space-y-3">
                {mockCoupons.slice(0, 2).map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCouponTypeColor(
                            coupon.type
                          )} flex items-center justify-center text-white`}
                        >
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {coupon.description}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {getCouponTypeLabel(coupon.type)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {coupon.discountPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">مكافآتي</h2>

            {mockCoupons.map((coupon) => {
              const daysRemaining = getDaysRemaining(coupon.expiresAt);
              const isExpiringSoon = daysRemaining <= 3;
              const isExpired = daysRemaining <= 0;

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    className={`overflow-hidden border-2 transition-all ${
                      isExpired
                        ? 'border-red-300 dark:border-red-600 opacity-60'
                        : 'border-purple-200 dark:border-purple-700 hover:border-purple-400'
                    }`}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${getCouponTypeColor(coupon.type)}`}
                    />

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCouponTypeColor(
                              coupon.type
                            )} flex items-center justify-center text-white text-2xl`}
                          >
                            {coupon.discountPercentage}%
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {coupon.description}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {getCouponTypeLabel(coupon.type)}
                            </p>
                          </div>
                        </div>
                        {isExpired && (
                          <div className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
                            منتهي الصلاحية
                          </div>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            ينتهي قريباً
                          </div>
                        )}
                        {!isExpiringSoon && !isExpired && (
                          <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                            نشط
                          </div>
                        )}
                      </div>

                      {/* Coupon Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            الحد الأدنى
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {coupon.minOrderAmount} ر.س
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            الاستخدامات
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {coupon.usedCount}/{coupon.maxUses}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            الصلاحية
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {daysRemaining} يوم
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            تاريخ الإنشاء
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {new Date(coupon.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>

                      {/* Coupon Code */}
                      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          كود الخصم
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <code className="text-lg font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                            {coupon.code}
                          </code>
                          <motion.button
                            onClick={() => handleCopyCoupon(coupon.code)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            {copied === coupon.code ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copied === coupon.code ? 'تم النسخ!' : 'نسخ الكود'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          disabled={isExpired || coupon.usedCount >= coupon.maxUses}
                        >
                          استخدم الآن
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">سجل الاستخدام</h2>
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">لا توجد عمليات استخدام حتى الآن</p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
