import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore: Record<string, string> = {};

export const storageService = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
      if (memoryStore[key]) {
        return JSON.parse(memoryStore[key]) as T;
      }
      return null;
    } catch {
      if (memoryStore[key]) {
        try {
          return JSON.parse(memoryStore[key]) as T;
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    memoryStore[key] = serialized;
    try {
      await AsyncStorage.setItem(key, serialized);
    } catch {
      // In-memory fallback holds the state for this session
    }
  },

  async removeItem(key: string): Promise<void> {
    delete memoryStore[key];
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  async clear(): Promise<void> {
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
    try {
      await AsyncStorage.clear();
    } catch {
      // ignore
    }
  },
};
