// Create an interface to define the Redis configuration
interface RedisConfig {
  host: string;
  password: string;
  port: number;
}

// Define the Redis configuration object
export const redis: RedisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  password: process.env.REDIS_PASSWORD || "",
  port: parseInt(process.env.REDIS_PORT || "6378", 10), // Use the default port 6379 if the environment variable is not set
};
