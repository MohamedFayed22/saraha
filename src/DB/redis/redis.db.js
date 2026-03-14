import { createClient } from "redis"


export const redisClient = createClient({
    url: process.env.REDIS_URL
});

export const redisConnection =  async () => {
    try{
        await redisClient.connect();
        console.log("Redis connected successfully")
    }catch (error) {
        console.log(error, "Redis connection failed.")
    }
}