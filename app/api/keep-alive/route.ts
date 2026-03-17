// app/api/keep-alive/route.ts
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(req: Request) {
  // Simple auth check so random people can't hit this
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await redis.ping();
  return Response.json({ ok: true, time: new Date().toISOString() });
}
