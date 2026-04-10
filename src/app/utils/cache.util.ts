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
