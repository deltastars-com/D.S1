import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 transition-all duration-300 ${isOnline ? 'bg-emerald-800 text-amber-300 border border-amber-500/30' : 'bg-red-900 text-white border border-red-500'}`}>
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5 text-amber-400" />
          <span>متصل بالإنترنت</span>
          {syncing && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-red-300 animate-pulse" />
          <span>وضع عدم الاتصال (تخزين محلي نشط)</span>
        </>
      )}
    </div>
  );
};
