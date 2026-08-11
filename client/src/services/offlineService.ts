/**
 * Offline Service - معالجة الوضع بدون إنترنت
 * يوفر دعماً كاملاً للعمل بدون اتصال بالإنترنت
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface DeltaStarsDB extends DBSchema {
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      price: number;
      image: string;
      description: string;
      category: string;
      timestamp: number;
    };
  };
  cart: {
    key: string;
    value: {
      id: string;
      productId: string;
      quantity: number;
      price: number;
      timestamp: number;
    };
  };
  orders: {
    key: string;
    value: {
      id: string;
      items: any[];
      total: number;
      status: string;
      timestamp: number;
    };
  };
  cache: {
    key: string;
    value: {
      url: string;
      data: any;
      timestamp: number;
      ttl: number;
    };
  };
}

class OfflineService {
  private db: IDBPDatabase<DeltaStarsDB> | null = null;
  private isOnline: boolean = navigator.onLine;

  async initialize() {
    try {
      this.db = await openDB<DeltaStarsDB>('DeltaStarsDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('cart')) {
            db.createObjectStore('cart', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('orders')) {
            db.createObjectStore('orders', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('cache')) {
            db.createObjectStore('cache', { keyPath: 'url' });
          }
        },
      });

      // الاستماع لتغييرات الاتصال بالإنترنت
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      console.log('✅ Offline Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Offline Service:', error);
    }
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('🟢 Back online');
    this.syncData();
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('🔴 Offline mode activated');
  }

  async cacheData(url: string, data: any, ttl: number = 3600000) {
    if (!this.db) return;
    try {
      await this.db.put('cache', {
        url,
        data,
        timestamp: Date.now(),
        ttl,
      });
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  async getCachedData(url: string) {
    if (!this.db) return null;
    try {
      const cached = await this.db.get('cache', url);
      if (!cached) return null;

      const isExpired = Date.now() - cached.timestamp > cached.ttl;
      if (isExpired) {
        await this.db.delete('cache', url);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return null;
    }
  }

  async saveProduct(product: any) {
    if (!this.db) return;
    try {
      await this.db.put('products', {
        ...product,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async getProducts() {
    if (!this.db) return [];
    try {
      return await this.db.getAll('products');
    } catch (error) {
      console.error('Error retrieving products:', error);
      return [];
    }
  }

  async addToCart(item: any) {
    if (!this.db) return;
    try {
      await this.db.put('cart', {
        ...item,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async getCart() {
    if (!this.db) return [];
    try {
      return await this.db.getAll('cart');
    } catch (error) {
      console.error('Error retrieving cart:', error);
      return [];
    }
  }

  async clearCart() {
    if (!this.db) return;
    try {
      await this.db.clear('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  async saveOrder(order: any) {
    if (!this.db) return;
    try {
      await this.db.put('orders', {
        ...order,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  async getPendingOrders() {
    if (!this.db) return [];
    try {
      const orders = await this.db.getAll('orders');
      return orders.filter((o) => o.status === 'pending');
    } catch (error) {
      console.error('Error retrieving pending orders:', error);
      return [];
    }
  }

  private async syncData() {
    console.log('🔄 Syncing data with server...');
    // سيتم تنفيذ المزامنة هنا عند استعادة الاتصال
  }

  isOnlineMode(): boolean {
    return this.isOnline;
  }

  getStatus() {
    return {
      online: this.isOnline,
      dbReady: this.db !== null,
      timestamp: Date.now(),
    };
  }
}

export const offlineService = new OfflineService();
