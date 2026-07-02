import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search, TrendingUp, DollarSign } from 'lucide-react';

export default function AccountingPanel() {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const invoices = [
    {
      id: 'INV-001',
      orderNumber: 'ORD-1001',
      customer: 'أحمد محمد',
      amount: 150,
      tax: 22.5,
      total: 172.5,
      date: '2026-07-01',
      status: 'paid',
      paymentMethod: 'mada',
    },
    {
      id: 'INV-002',
      orderNumber: 'ORD-1002',
      customer: 'فاطمة علي',
      amount: 200,
      tax: 30,
      total: 230,
      date: '2026-07-01',
      status: 'pending',
      paymentMethod: 'visa',
    },
    {
      id: 'INV-003',
      orderNumber: 'ORD-1003',
      customer: 'محمد سالم',
      amount: 175,
      tax: 26.25,
      total: 201.25,
      date: '2026-06-30',
      status: 'paid',
      paymentMethod: 'cash',
    },
  ];

  const stats = [
    { label: 'إجمالي الفواتير', value: '603.75 ر.س', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'الضرائب المجمعة', value: '78.75 ر.س', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { label: 'الفواتير المدفوعة', value: '2', icon: FileText, color: 'from-purple-500 to-purple-600' },
    { label: 'الفواتير المعلقة', value: '1', icon: Filter, color: 'from-orange-500 to-orange-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع';
      case 'pending':
        return 'معلق';
      case 'overdue':
        return 'متأخر';
      default:
        return 'غير محدد';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'mada':
        return 'مدى';
      case 'visa':
        return 'فيزا';
      case 'cash':
        return 'دفع عند الاستلام';
      default:
        return 'غير محدد';
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesType = filterType === 'all' || invoice.status === filterType;
    const matchesSearch =
      invoice.id.includes(searchTerm) ||
      invoice.customer.includes(searchTerm) ||
      invoice.orderNumber.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            قسم المحاسبة والفواتير
          </h1>
          <p className="text-slate-400 text-sm mt-1">إدارة الفواتير والمعاملات المالية</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم الفاتورة أو العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="paid">مدفوع</option>
              <option value="pending">معلق</option>
              <option value="overdue">متأخر</option>
            </select>

            {/* Export */}
            <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              تصدير التقرير
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700 border-b border-slate-600">
                  <th className="px-6 py-4 text-right text-sm font-semibold">رقم الفاتورة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">رقم الطلب</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">العميل</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">المبلغ</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">الضريبة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">الإجمالي</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">طريقة الدفع</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-emerald-400">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{invoice.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{invoice.amount} ر.س</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{invoice.tax} ر.س</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-400">{invoice.total} ر.س</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{getPaymentMethodLabel(invoice.paymentMethod)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg border border-slate-700 p-6"
          >
            <h3 className="text-lg font-bold mb-4">الإيرادات اليومية</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>2026-07-01</span>
                <span className="text-emerald-400 font-bold">402.5 ر.س</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>2026-06-30</span>
                <span className="text-emerald-400 font-bold">201.25 ر.س</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-lg border border-slate-700 p-6"
          >
            <h3 className="text-lg font-bold mb-4">طرق الدفع</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>مدى</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '33%' }}></div>
                  </div>
                  <span className="text-sm text-slate-400">172.5 ر.س</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>فيزا</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '38%' }}></div>
                  </div>
                  <span className="text-sm text-slate-400">230 ر.س</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>دفع عند الاستلام</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '33%' }}></div>
                  </div>
                  <span className="text-sm text-slate-400">201.25 ر.س</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
