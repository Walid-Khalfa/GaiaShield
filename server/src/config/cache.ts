import { LRUCache } from 'lru-cache';

export interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new LRUCache<string, CacheEntry>({
  max: 256,
  ttl: 1000 * 60 * 10, // 10 minutes
  updateAgeOnGet: true,
});

export const cacheService = {
  get: (key: string): unknown | null => {
    const entry = cache.get(key);
    return entry ? entry.data : null;
  },

  set: (key: string, data: unknown): void => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  has: (key: string): boolean => {
    return cache.has(key);
  },

  clear: (): void => {
    cache.clear();
  },

  size: (): number => {
    return cache.size;
  },
};
