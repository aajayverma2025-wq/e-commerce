import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './userSlice';
import siteReducer from './siteSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import vendorReducer from './vendorSlice';
import discountReducer from './discountSlice';
import paymentReducer from './paymentSlice';
import shippingReducer from './shippingSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const createIndexedDBStorage = (dbName = 'reduxPersist', storeName = 'state') => {
  const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const isSupported = typeof window !== 'undefined' && 'indexedDB' in window;

  const localStorageFallback = {
    getItem(key: string) {
      return Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null);
    },
    setItem(key: string, value: string) {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, value);
        } catch (e) {
          console.error('localStorage setItem failed:', e);
        }
      }
      return Promise.resolve();
    },
    removeItem(key: string) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
  };

  if (!isSupported) {
    return localStorageFallback;
  }

  return {
    async getItem(key: string): Promise<string | null> {
      try {
        const db = await getDB();
        const value = await new Promise<string | null>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
        });

        // Migration from localStorage
        if (value === null && typeof window !== 'undefined') {
          const localValue = window.localStorage.getItem(key);
          if (localValue) {
            await this.setItem(key, localValue);
            try {
              window.localStorage.removeItem(key);
            } catch (e) {}
            return localValue;
          }
        }
        return value;
      } catch (e) {
        console.error('IndexedDB getItem fallback to localStorage:', e);
        return localStorageFallback.getItem(key);
      }
    },
    async setItem(key: string, value: string): Promise<void> {
      try {
        const db = await getDB();
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(value, key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('IndexedDB setItem fallback to localStorage:', e);
        return localStorageFallback.setItem(key, value);
      }
    },
    async removeItem(key: string): Promise<void> {
      try {
        const db = await getDB();
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.error('IndexedDB removeItem fallback to localStorage:', e);
        return localStorageFallback.removeItem(key);
      }
    }
  };
};

const storage = typeof window !== 'undefined' ? createIndexedDBStorage() : createNoopStorage();

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  site: siteReducer,
  cart: cartReducer,
  products: productReducer,
  orders: orderReducer,
  vendors: vendorReducer,
  discounts: discountReducer,
  payments: paymentReducer,
  shipping: shippingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
