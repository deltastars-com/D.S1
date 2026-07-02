import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, AlertCircle, Phone, MessageSquare } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  status: string;
  driver: string;
  driverPhone: string;
  distance: number;
  eta: string;
  lat: number;
  lng: number;
  driverLat: number;
  driverLng: number;
  items: number;
  amount: number;
}

export default function GPSTracking() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const orders: Order[] = [
    {
      id: 'ORD-1001',
      customer: 'أحمد محمد',
      phone: '0501234567',
      address: 'حي النخيل، الرياض',
      status: 'في الطريق',
      driver: 'علي حسن',
      driverPhone: '0502222222',
      distance: 2.5,
      eta: '10 دقائق',
      lat: 24.7136,
      lng: 46.6753,
      driverLat: 24.7200,
      driverLng: 46.6800,
      items: 3,
      amount: 150,
    },
    {
      id: 'ORD-1002',
      customer: 'فاطمة علي',
      phone: '0505555555',
      address: 'حي الملز، الرياض',
      status: 'قيد الجهز',
      driver: 'محمد سالم',
      driverPhone: '0503333333',
      distance: 0,
      eta: 'قيد الجهز',
      lat: 24.7400,
      lng: 46.6900,
      driverLat: 0,
      driverLng: 0,
      items: 5,
      amount: 200,
    },
    {
      id: 'ORD-1003',
      customer: 'محمود خالد',
      phone: '0507777777',
      address: 'حي الشفا، الرياض',
      status: 'تم التسليم',
      driver: 'سارة أحمد',
      driverPhone: '0504444444',
      distance: 0,
      eta: 'تم التسليم',
      lat: 24.7300,
      lng: 46.7000,
      driverLat: 24.7300,
      driverLng: 46.7000,
      items: 2,
      amount: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'في الطريق':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'قيد الجهز':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'تم التسليم':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            نظام GPS والتتبع المباشر
          </h1>
          <p className="text-slate-400 text-sm mt-1">تتبع الطلبات والسائقين في الوقت الفعلي</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden h-96"
          >
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-slate-700/50 flex flex-col items-center justify-center">
                <MapPin className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-slate-400">خريطة تفاعلية - Google Maps Integration</p>
              </div>

              {/* Map Markers */}
              {selectedOrder && selectedOrder.driverLat !== 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Customer Location */}
                    <div
                      className="absolute w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                      style={{
                        left: `${(selectedOrder.lat % 1) * 100}%`,
                        top: `${(selectedOrder.lng % 1) * 100}%`,
                      }}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>

                    {/* Driver Location */}
                    <div
                      className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse"
                      style={{
                        left: `${(selectedOrder.driverLat % 1) * 100}%`,
                        top: `${(selectedOrder.driverLng % 1) * 100}%`,
                      }}
                    >
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-bold mb-4">الطلبات النشطة</h3>
            {orders.map((order, index) => (
              <motion.button
                key={order.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedOrder(order as Order)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedOrder?.id === order.id
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">{order.id}</span>
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-1">{order.customer}</p>
                <p className="text-xs text-slate-400">{order.address}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Selected Order Details */}
        {selectedOrder && (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Customer Info */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">معلومات العميل</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">الاسم</p>
                  <p className="text-white font-medium">{selectedOrder?.customer}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">الهاتف</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-white font-medium">{selectedOrder?.phone}</p>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">العنوان</p>
                  <p className="text-white font-medium">{selectedOrder?.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-sm">عدد المنتجات</p>
                    <p className="text-emerald-400 font-bold text-lg">{selectedOrder?.items}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">المبلغ</p>
                    <p className="text-emerald-400 font-bold text-lg">{selectedOrder?.amount} ر.س</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">معلومات السائق</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">الاسم</p>
                  <p className="text-white font-medium">{selectedOrder?.driver}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">الهاتف</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-white font-medium">{selectedOrder?.driverPhone}</p>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">الحالة</p>
                  <p className="text-white font-medium">{selectedOrder?.status}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-sm">المسافة</p>
                    <p className="text-blue-400 font-bold text-lg">{selectedOrder?.distance} كم</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">الوقت المتبقي</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <p className="text-blue-400 font-bold">{selectedOrder?.eta}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-bold mb-4">تفاصيل التوصيل</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <span>موقع العميل</span>
                  <span className="text-emerald-400 font-mono text-sm">
                    {selectedOrder?.lat.toFixed(4)}, {selectedOrder?.lng.toFixed(4)}
                  </span>
                </div>
                {selectedOrder && selectedOrder.driverLat !== 0 && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span>موقع السائق</span>
                      <span className="text-blue-400 font-mono text-sm">
                        {selectedOrder.driverLat.toFixed(4)}, {selectedOrder.driverLng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <span>المسافة المحسوبة</span>
                      <span className="text-yellow-400 font-bold">
                        {calculateDistance(
                          selectedOrder.lat,
                          selectedOrder.lng,
                          selectedOrder.driverLat,
                          selectedOrder.driverLng
                        )}{' '}
                        كم
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <span>رسم التوصيل</span>
                  <span className="text-emerald-400 font-bold">15 ر.س</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
