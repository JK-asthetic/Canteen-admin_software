import { getCurrentServerTime, ServerTime } from "@/api/time.api";

let cachedServerTime: ServerTime | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute

/**
 * Get current server time (with 1-minute cache to reduce API calls)
 */
export const getServerTime = async (): Promise<ServerTime> => {
  const now = Date.now();
  
  // Return cached value if still valid
  if (cachedServerTime && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedServerTime;
  }
  
  // Fetch fresh server time
  cachedServerTime = await getCurrentServerTime();
  cacheTimestamp = now;
  
  return cachedServerTime;
};

/**
 * Get current date as Date object from server
 */
export const getServerDate = async (): Promise<Date> => {
  const serverTime = await getServerTime();
  return new Date(serverTime.istTime);
};

/**
 * Get start of today in IST from server
 */
export const getServerStartOfDay = async (): Promise<Date> => {
  const serverTime = await getServerTime();
  return new Date(serverTime.utcStartOfDay);
};

/**
 * Check if a date is today according to server time
 */
export const isServerToday = async (date: Date): Promise<boolean> => {
  const serverTime = await getServerTime();
  const serverDate = new Date(serverTime.istTime);
  
  const todayStart = new Date(serverDate);
  todayStart.setHours(0, 0, 0, 0);
  
  const selectedStart = new Date(date);
  selectedStart.setHours(0, 0, 0, 0);
  
  return todayStart.getTime() === selectedStart.getTime();
};

/**
 * Clear the cache (useful when you need fresh server time)
 */
export const clearServerTimeCache = (): void => {
  cachedServerTime = null;
  cacheTimestamp = 0;
};