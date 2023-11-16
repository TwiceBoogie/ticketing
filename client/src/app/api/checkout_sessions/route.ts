import { createRedisInstance } from "@/core/config";

const redis = createRedisInstance();
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const cookieArray = req.headers.get("Cookie")?.split("; ").filter(Boolean);
    const jwtCookie = cookieArray?.find((cookie) => cookie.startsWith("jwt="));

    const order = redis.get(`user:${jwtCookie}`);
    return Response.json({ order });
  } catch (error) {
    console.log(error);
  }
}
