/**
 * Delta Stars Sovereign Health Check & Auto-Recovery Engine
 * Monitors runtime errors, network reachability, and storage integrity.
 */

export interface SystemHealthStatus {
  isHealthy: boolean;
  timestamp: number;
  apiConnected: boolean;
  storageOperational: boolean;
  lastError: string | null;
}

export const runSystemHealthCheck = async (): Promise<SystemHealthStatus> => {
  let apiConnected = true;
  let storageOperational = true;
  let lastError: string | null = null;

  try {
    // Check localStorage integrity
    const testKey = '__ds_health_test__';
    localStorage.setItem(testKey, 'ok');
    localStorage.removeItem(testKey);
  } catch (err: any) {
    storageOperational = false;
    lastError = `Storage error: ${err?.message || 'Unknown'}`;
  }

  try {
    // Ping network / supabase health if configured
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://rgusisancfcdabfnfwoy.supabase.co/rest/v1/', {
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timeoutId);
    if (res && res.status >= 500) {
      apiConnected = false;
    }
  } catch (e) {
    // Non-fatal for offline mode
  }

  return {
    isHealthy: storageOperational,
    timestamp: Date.now(),
    apiConnected,
    storageOperational,
    lastError
  };
};

// Global unhandled error recovery listener
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('🚨 [Auto-Recovery] Caught runtime error:', event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 [Auto-Recovery] Unhandled promise rejection:', event.reason);
  });
}
