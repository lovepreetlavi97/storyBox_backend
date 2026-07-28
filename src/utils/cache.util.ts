const cache: { [key: string]: { data: any; expiry: number } } = {};

export function getCached(key: string): any | null {
  const entry = cache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

export function setCache(key: string, data: any, ttlMs: number = 10000): void {
  cache[key] = { data, expiry: Date.now() + ttlMs };
}

export function clearCache(): void {
  for (const key in cache) {
    delete cache[key];
  }
}
