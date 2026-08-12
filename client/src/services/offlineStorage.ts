// Delta Stars Offline Storage & Sync Service
export interface OfflineProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stock?: number;
}

const STORAGE_KEYS = {
  PRODUCTS: 'delta_offline_products_v3',
  PROMOTIONS: 'delta_offline_promotions_v3',
  BRANCHES: 'delta_offline_branches_v3',
  CART: 'delta_offline_cart_v3',
  PENDING_ORDERS: 'delta_offline_orders_v3'
};

export const defaultOfflineProducts: OfflineProduct[] = [
  { id: 1, name: "طماطم عضوية طازجة (جدة)", price: 12.5, category: "خضار", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80", stock: 150 },
  { id: 2, name: "خيار مبرد طازج (الرياض)", price: 8.0, category: "خضار", image: "https://images.unsplash.com/photo-1449300079323-02e20989d8a2?auto=format&fit=crop&w=500&q=80", stock: 200 },
  { id: 3, name: "تمر صقعي فاخر (القصيم)", price: 45.0, category: "تمور", image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=500&q=80", stock: 500 },
  { id: 4, name: "تفاح سكري أحمر (مكة)", price: 18.0, category: "فواكه", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80", stock: 120 }
];

export const saveOfflineData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Offline save error", e);
  }
};

export const getOfflineData = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const getCachedProducts = (): OfflineProduct[] => {
  return getOfflineData(STORAGE_KEYS.PRODUCTS, defaultOfflineProducts);
};

export const cacheProducts = (products: OfflineProduct[]) => {
  saveOfflineData(STORAGE_KEYS.PRODUCTS, products);
};
