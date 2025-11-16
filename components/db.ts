import type { Card, Transaction } from '../data/mockData';

const DB_NAME = 'AuriMeaDB';
const DB_VERSION = 1;
export const STORES = {
  cards: 'cards',
  manualTransactions: 'manualTransactions',
};

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORES.cards)) {
        dbInstance.createObjectStore(STORES.cards, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(STORES.manualTransactions)) {
        dbInstance.createObjectStore(STORES.manualTransactions, { keyPath: 'id' });
      }
      if (dbInstance.objectStoreNames.contains('fixedCosts')) {
          dbInstance.deleteObjectStore('fixedCosts');
      }
    };
  });
};

export const getAll = <T>(storeName: string): Promise<T[]> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const add = <T>(storeName: string, item: T): Promise<IDBValidKey> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

export const put = <T>(storeName: string, item: T): Promise<IDBValidKey> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

export const deleteItem = (storeName: string, key: IDBValidKey): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

export const clearStore = (storeName: string): Promise<void> => {
     return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

export const bulkAdd = <T>(storeName: string, items: T[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (items.length === 0) return resolve();
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        
        items.forEach(item => store.add(item));
    });
};