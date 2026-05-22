import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) await redisClient.connect();
};

export const setCache = async (key: string, value: any, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};

export const deleteCachePattern = async (pattern: string) => {
  if (!redisClient.isOpen) await redisClient.connect();
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export const invalidateDashboardCache = async (mosqueId: string) => {
  try {
    await deleteCachePattern(`dashboard:stats:${mosqueId}:*`);
    await deleteCachePattern(`dashboard:chart:monthly:${mosqueId}:*`);
    await deleteCachePattern(`members:list:${mosqueId}:*`);
  } catch (error) {
    console.error(`Failed to invalidate dashboard cache for mosque ${mosqueId}:`, error);
  }
};
