import { redisClient } from "./redis.db.js";

export const setValue = async ({ key, value, ttl }) => {
  try {
    const data = typeof value == "string" ? value : JSON.stringify(value);
    return ttl
      ? await redisClient.set(key, data, {
          EX: ttl,
        })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log(error, "failed to set value in redis.");
  }
};

export const revoke_key = ({ userId, jti }) => {
  return `revoke_token::${userId}::${jti}`;
};

export const get_key = ({ userId }) => {
  return `revoke_token::${userId}`;
};

export const otp_key = ({ email }) => {
  return `otp::${email}`;
};

export const update = async ({ key, value, ttl }) => {
  try {
    if (!(await exists(key))) return;
    return await setValue({ key, value, ttl });
  } catch (error) {
    console.log(error, "failed to update value in redis.");
  }
};

export const get = async (key) => {
  try {
    try {
      return JSON.parse(await redisClient.get(key));
    } catch (error) {
      return await redisClient.get(key);
    }
  } catch (error) {
    console.log(error, "failed to get value from redis.");
  }
};

export const ttl = async (key) => {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.log(error, "failed to get ttl from redis.");
  }
};

export const exists = async (key) => {
  try {
    return await redisClient.exists(key);
  } catch (error) {
    console.log(error, "failed to check key exists in redis.");
  }
};

export const expire = async ({ key, ttl }) => {
  try {
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log(error, "failed to check key exists in redis.");
  }
};

export const deleteKey = async (key) => {
  try {
    if (!key.length) return;
    return await redisClient.del(key);
  } catch (error) {
    console.log(error, "failed to get ttl from redis.");
  }
};

export const keys = async (pattern) => {
  try {
    return await redisClient.keys(`${pattern}*`);
  } catch (error) {
    console.log(error, "failed to get ttl from redis.");
  }
};

export const flushAll = async () => {
  try {
    return await redisClient.flushAll();
  } catch (error) {
    console.log(error, "failed to get ttl from redis.");
  }
};

export const flushDb = async () => {
  try {
    return await redisClient.flushDb();
  } catch (error) {
    console.log(error, "failed to get ttl from redis.");
  }
};
