import config from "@/lib/config";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: config.env.uptash.redisURL,
    token: config.env.uptash.redisToken,
})


export default redis;