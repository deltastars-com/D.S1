import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Zap, Trophy, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function PromotionsHall() {
  const [activeTab, setActiveTab] = useState('promotions');

  const promotions = [
    {
      id: 1,
      title: 'عرض الصيف الكبير',
      description: 'خصم 50% على جميع المنتجات المختارة',
      discount: '50%',
      startDate: '2026-07-01',
      endDate: '2026-08-31',
      status: 'نشط',
      views: 15234,
      clicks: 1523,
    },
    {
      id: 2,
      title: 'عرض نهاية الأسبوع',
      description: 'اشتري 2 واحصل على الثالث مجاني',
      discount: 'شراء 2 + 1',
      startDate: '2026-07-05',
      endDate: '2026-07-06',
      status: 'نشط',
      views: 8932,
      clicks: 892,
    },
  ];

  const advertisements = [
    {
      id: 1,
      title: 'إعلان المنتجات الجديدة',
      description: 'تعرف على أحدث المنتجات',
      type: 'banner',
      position: 'رأس الصفحة',
      status: 'نشط',
      impressions: 45000,
      clicks: 4500,
    },
    {
      id: 2,
      title: 'إعلان الخدمات المميزة',
      description: 'توصيل سريع وآمن',
      type: 'sidebar',
      position: 'الشريط الجانبي',
      status: 'نشط',
      impressions: 32000,
      clicks: 2800,
    },
  ];

  const contests = [
    {
      id: 1,
      title: 'مسابقة التصوير',
      description: 'صور أجمل لحظة مع منتجاتنا',
      prize: '1000 ريال',
      status: 'نشط',
      participants: 234,
      submissions: 89,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              صالة العروض والإعلانات
            </h1>
            <p className="text-slate-400 text-sm mt-1">إدارة العروض والإعلانات والمسابقات</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            إضافة جديد
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'promotions', label: 'العروض', icon: Zap },
            { id: 'ads', label: 'الإعلانات', icon: Megaphone },
            { id: 'contests', label: 'المسابقات', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Promotions */}
        {activeTab === 'promotions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold">{promo.title}</h3>
                  <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {promo.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{promo.description}</p>
                <div className="bg-slate-700 rounded p-3 mb-4">
                  <p className="text-emerald-400 font-bold text-lg text-center">{promo.discount}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-slate-400">من</p>
                    <p className="font-medium">{promo.startDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">إلى</p>
                    <p className="font-medium">{promo.endDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition-colors">
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Advertisements */}
        {activeTab === 'ads' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700 border-b border-slate-600">
                      <th className="px-6 py-4 text-right text-sm font-semibold">العنوان</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">النوع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الموضع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الانطباعات</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">النقرات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisements.map((ad, index) => (
                      <motion.tr
                        key={ad.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">{ad.title}</td>
                        <td className="px-6 py-4 text-sm">{ad.type}</td>
                        <td className="px-6 py-4 text-sm">{ad.position}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {ad.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-400">{ad.impressions}</td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-400">{ad.clicks}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contests */}
        {activeTab === 'contests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{contest.title}</h3>
                  <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {contest.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{contest.description}</p>
                <div className="bg-slate-700 rounded p-3 mb-4">
                  <p className="text-emerald-400 font-bold text-lg text-center">{contest.prize}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm border-t border-slate-700 pt-4">
                  <div>
                    <p className="text-slate-400">المشاركون</p>
                    <p className="font-bold text-blue-400">{contest.participants}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">المشاركات</p>
                    <p className="font-bold text-blue-400">{contest.submissions}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
