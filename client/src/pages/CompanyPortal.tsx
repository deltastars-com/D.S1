import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, FileText, Handshake, Lock, LogOut, BarChart3 } from 'lucide-react';

export default function CompanyPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyData, setCompanyData] = useState({
    name: 'شركة النجم للتوزيع',
    taxId: '123456789',
    phone: '0114567890',
    email: 'info@company.com',
    monthlyAmount: 50000,
    discount: 5,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">بوابة الشركات</h1>
            <p className="text-slate-400">نظام التعاقد الإلكتروني وإدارة الحسابات</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                placeholder="0501234567"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">كود التحقق</label>
              <input
                type="text"
                placeholder="أدخل الكود المرسل بالرسالة"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              تسجيل الدخول
            </button>

            <p className="text-center text-slate-400 text-sm">
              لم تستقبل الكود؟{' '}
              <button type="button" className="text-blue-400 hover:text-blue-300">
                إعادة إرسال
              </button>
            </p>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-4">أو سجل حسابك الآن</p>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              إنشاء حساب جديد
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'contracts', label: 'العقود', icon: FileText },
    { id: 'negotiations', label: 'المفاوضات', icon: Handshake },
    { id: 'security', label: 'الأمان', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              بوابة الشركات وكبار العملاء
            </h1>
            <p className="text-slate-400 text-sm mt-1">مرحباً {companyData.name}</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-bold mb-4">معلومات الشركة</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400">الاسم:</span>
                    <p className="text-white font-medium">{companyData.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">الرقم الضريبي:</span>
                    <p className="text-white font-medium">{companyData.taxId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">الهاتف:</span>
                    <p className="text-white font-medium">{companyData.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">البريد الإلكتروني:</span>
                    <p className="text-white font-medium">{companyData.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-bold mb-4">تفاصيل العقد</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400">المبلغ الشهري:</span>
                    <p className="text-emerald-400 font-bold text-lg">{companyData.monthlyAmount} ر.س</p>
                  </div>
                  <div>
                    <span className="text-slate-400">الخصم:</span>
                    <p className="text-emerald-400 font-bold">{companyData.discount}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400">حالة العقد:</span>
                    <p className="text-emerald-400 font-bold">نشط</p>
                  </div>
                  <div>
                    <span className="text-slate-400">تاريخ الانتهاء:</span>
                    <p className="text-white font-medium">2027-07-02</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white"
              >
                <p className="text-sm opacity-90 mb-2">إجمالي الطلبات</p>
                <p className="text-3xl font-bold">1,234</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white"
              >
                <p className="text-sm opacity-90 mb-2">إجمالي المبلغ</p>
                <p className="text-3xl font-bold">600,000 ر.س</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white"
              >
                <p className="text-sm opacity-90 mb-2">الطلبات هذا الشهر</p>
                <p className="text-3xl font-bold">156</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white"
              >
                <p className="text-sm opacity-90 mb-2">الرصيد المتبقي</p>
                <p className="text-3xl font-bold">45,000 ر.س</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Contracts */}
        {activeTab === 'contracts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">العقود النشطة</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-slate-700 rounded">
                  <div>
                    <p className="font-bold">عقد توزيع شهري</p>
                    <p className="text-sm text-slate-400">من 2026-07-02 إلى 2027-07-02</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Negotiations */}
        {activeTab === 'negotiations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">المفاوضات الجارية</h3>
              <p className="text-slate-400">لا توجد مفاوضات جارية حالياً</p>
            </div>
          </motion.div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">الأمان والمصادقة</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-slate-700 rounded">
                  <div>
                    <p className="font-bold">البصمة الإلكترونية</p>
                    <p className="text-sm text-slate-400">تفعيل التحقق البيومتري</p>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded transition-colors">
                    تفعيل
                  </button>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700 rounded">
                  <div>
                    <p className="font-bold">التوقيع الإلكتروني</p>
                    <p className="text-sm text-slate-400">توقيع آمن على العقود</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                    تفعيل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
