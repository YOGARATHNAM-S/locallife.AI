
import { ChatMessage, City, AppMode } from '../types';

const DB_NAME = 'LocalLifeAI_DB';
const STORE_NAME = 'chat_history';
const SETTINGS_STORE = 'settings';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE);
      }
    };
  });
};

export const saveMessage = async (message: ChatMessage) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(message);
};

export const getHistory = async (city: City, mode: AppMode): Promise<ChatMessage[]> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const all = request.result as ChatMessage[];
      resolve(all.filter(m => m.city === city && m.mode === mode).sort((a, b) => a.timestamp - b.timestamp));
    };
  });
};

export const clearHistory = async (city: City, mode: AppMode) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    const toDelete = (request.result as ChatMessage[]).filter(m => m.city === city && m.mode === mode);
    toDelete.forEach(m => store.delete(m.id));
  };
};

export const saveSetting = async (key: string, value: any) => {
  const db = await initDB();
  const tx = db.transaction(SETTINGS_STORE, 'readwrite');
  const store = tx.objectStore(SETTINGS_STORE);
  store.put(value, key);
};

export const getSetting = async (key: string): Promise<any> => {
  const db = await initDB();
  const tx = db.transaction(SETTINGS_STORE, 'readonly');
  const store = tx.objectStore(SETTINGS_STORE);
  const request = store.get(key);

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
  });
};
