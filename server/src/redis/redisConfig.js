import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisPub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const redisSub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export { redisPub, redisSub };
