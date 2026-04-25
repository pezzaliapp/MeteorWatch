import { get, set } from 'idb-keyval';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const entry = (await get(key)) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) return null;
    return entry.value;
  } catch {
    return null;
  }
}

export async function getCachedAny<T>(key: string): Promise<T | null> {
  try {
    const entry = (await get(key)) as CacheEntry<T> | undefined;
    return entry?.value ?? null;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttlMs: number): Promise<void> {
  try {
    await set(key, { value, expiresAt: Date.now() + ttlMs } satisfies CacheEntry<T>);
  } catch {
    /* ignore quota errors */
  }
}

interface CachedFetchOpts<T> {
  key: string;
  ttlMs: number;
  fetcher: () => Promise<T>;
  fallback?: T | (() => Promise<T> | T);
}

export async function cachedFetch<T>({ key, ttlMs, fetcher, fallback }: CachedFetchOpts<T>): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== null) return cached;
  try {
    const value = await fetcher();
    await setCached(key, value, ttlMs);
    return value;
  } catch (err) {
    const stale = await getCachedAny<T>(key);
    if (stale !== null) return stale;
    if (fallback !== undefined) {
      return typeof fallback === 'function' ? await (fallback as () => Promise<T> | T)() : fallback;
    }
    throw err;
  }
}
