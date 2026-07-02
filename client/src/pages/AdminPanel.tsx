import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, BarChart3, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('branches');
  const [showAddForm, setShowAddForm] = useState(false);

  const branches = [
    {
      id: 1,
      nameAr: 'الفرع الرئيسي',
      nameEn: 'Main Branch',
      city: 'الرياض',
      region: 'حي النخيل',
      phone: '0114444444',
      manager: 'أحمد محمد',
      active: true,
      employees: 15,
      orders: 234,
    },
    {
      id: 2,
      nameAr: 'فرع الملز',
      nameEn: 'Al-Malaz Branch',
      city: 'الرياض',
      region: 'حي الملز',
      phone: '0115555555',
      manager: 'فاطمة علي',
      active: true,
      employees: 12,
      orders: 189,
    },
    {
      id: 3,
      nameAr: 'فرع الشفا',
      nameEn: 'Al-Shafa Branch',
      city: 'الرياض',
      region: 'حي الشفا',
      phone: '0116666666',
      manager: 'محمد سالم',
      active: true,
      employees: 10,
      orders: 156,
    },
    {
      id: 4,
      nameAr: 'فرع جدة',
      nameEn: 'Jeddah Branch',
      city: 'جدة',
      region: 'حي البلد',
      phone: '0122222222',
      manager: 'علي حسن',
      active: true,
      employees: 18,
      orders: 267,
    },
    {
      id: 5,
      nameAr: 'فرع الدمام',
      nameEn: 'Dammam Branch',
      city: 'الدمام',
      region: 'حي الخليج',
      phone: '0133333333',
      manager: 'سارة أحمد',
      active: true,
      employees: 14,
      orders: 198,
    },
    {
      id: 6,
      nameAr: 'فرع أبها',
      nameEn: 'Abha Branch',
      city: 'أبها',
      region: 'حي الندوة',
      phone: '0177777777',
      manager: 'خالد محمود',
      active: true,
      employees: 11,
      orders: 142,
    },
  ];

  const areas = [
    { id: 1, nameAr: 'حي النخيل', city: 'الرياض', deliveryFee: 15, branch: 'الفرع الرئيسي' },
    { id: 2, nameAr: 'حي الملز', city: 'الرياض', deliveryFee: 15, branch: 'الفرع الرئيسي' },
    { id: 3, nameAr: 'حي الشفا', city: 'الرياض', deliveryFee: 20, branch: 'فرع الشفا' },
    { id: 4, nameAr: 'حي البلد', city: 'جدة', deliveryFee: 18, branch: 'فرع جدة' },
    { id: 5, nameAr: 'حي الخليج', city: 'الدمام', deliveryFee: 22, branch: 'فرع الدمام' },
    { id: 6, nameAr: 'حي الندوة', city: 'أبها', deliveryFee: 25, branch: 'فرع أبها' },
  ];

  const employees = [
    { id: 1, name: 'أحمد محمد', role: 'مدير فرع', branch: 'الفرع الرئيسي', phone: '0501111111', status: 'نشط' },
    { id: 2, name: 'فاطمة علي', role: 'مدير فرع', branch: 'فرع الملز', phone: '0502222222', status: 'نشط' },
    { id: 3, name: 'محمد سالم', role: 'مندوب مخازن', branch: 'الفرع الرئيسي', phone: '0503333333', status: 'نشط' },
    { id: 4, name: 'علي حسن', role: 'سائق', branch: 'فرع جدة', phone: '0504444444', status: 'نشط' },
    { id: 5, name: 'سارة أحمد', role: 'مدير فرع', branch: 'فرع الدمام', phone: '0505555555', status: 'نشط' },
  ];

  const tabs = [
    { id: 'branches', label: 'الفروع', icon: Building2 },
    { id: 'areas', label: 'المناطق', icon: MapPin },
    { id: 'employees', label: 'الموظفون', icon: Users },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              قسم الإدارة العامة
            </h1>
            <p className="text-slate-400 text-sm mt-1">إدارة الفروع والمناطق والموظفين</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة جديد
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

        {/* Content */}
        {activeTab === 'branches' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{branch.nameAr}</h3>
                      <p className="text-slate-400 text-sm">{branch.city}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">نشط</span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-400">المنطقة:</span> {branch.region}
                    </p>
                    <p>
                      <span className="text-slate-400">المدير:</span> {branch.manager}
                    </p>
                    <p>
                      <span className="text-slate-400">الهاتف:</span> {branch.phone}
                    </p>
                    <p>
                      <span className="text-slate-400">الموظفون:</span> {branch.employees}
                    </p>
                    <p>
                      <span className="text-slate-400">الطلبات:</span> {branch.orders}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                      <Edit className="w-4 h-4" />
                      تعديل
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-sm transition-colors">
                      <Eye className="w-4 h-4" />
                      عرض
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'areas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700 border-b border-slate-600">
                      <th className="px-6 py-4 text-right text-sm font-semibold">المنطقة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">المدينة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الفرع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">رسم التوصيل</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areas.map((area, index) => (
                      <motion.tr
                        key={area.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">{area.nameAr}</td>
                        <td className="px-6 py-4 text-sm">{area.city}</td>
                        <td className="px-6 py-4 text-sm">{area.branch}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-400">{area.deliveryFee} ر.س</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'employees' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700 border-b border-slate-600">
                      <th className="px-6 py-4 text-right text-sm font-semibold">الاسم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الوظيفة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الفرع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الهاتف</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">{emp.name}</td>
                        <td className="px-6 py-4 text-sm">{emp.role}</td>
                        <td className="px-6 py-4 text-sm">{emp.branch}</td>
                        <td className="px-6 py-4 text-sm">{emp.phone}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">أداء الفروع</h3>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div key={branch.id} className="flex justify-between items-center">
                    <span>{branch.nameAr}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${(branch.orders / 267) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-400">{branch.orders}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">إحصائيات عامة</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span>إجمالي الفروع</span>
                  <span className="font-bold text-emerald-400">6</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span>إجمالي الموظفين</span>
                  <span className="font-bold text-emerald-400">80</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span>إجمالي المناطق</span>
                  <span className="font-bold text-emerald-400">6</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span>إجمالي الطلبات</span>
                  <span className="font-bold text-emerald-400">1,186</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
