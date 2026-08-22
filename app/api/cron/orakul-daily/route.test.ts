import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET, POST } from "./route";

describe("Cron Security — app/api/cron/orakul-daily/route.ts", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("fails closed with 500 when CRON_SECRET is NOT configured in environment", async () => {
    delete process.env.CRON_SECRET;

    const req = new Request("http://localhost:3000/api/cron/orakul-daily", {
      method: "GET",
      headers: {
        authorization: "Bearer some-token",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("CRON_SECRET eksik");
  });

  it("returns 401 when authorization header is missing while CRON_SECRET is set", async () => {
    process.env.CRON_SECRET = "super-secure-cron-secret-123";

    const req = new Request("http://localhost:3000/api/cron/orakul-daily", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain("Yetkisiz erişim");
  });

  it("returns 401 when authorization header contains invalid secret", async () => {
    process.env.CRON_SECRET = "super-secure-cron-secret-123";

    const req = new Request("http://localhost:3000/api/cron/orakul-daily", {
      method: "POST",
      headers: {
        authorization: "Bearer wrong-secret",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain("Yetkisiz erişim");
  });

  it("returns 429 Too Many Requests when request limit is exceeded", async () => {
    process.env.CRON_SECRET = "super-secure-cron-secret-123";
    const testIp = "192.0.2.1";

    const makeReq = () =>
      new Request("http://localhost:3000/api/cron/orakul-daily", {
        method: "GET",
        headers: {
          authorization: "Bearer super-secure-cron-secret-123",
          "x-real-ip": testIp,
        },
      });

    // Send 3 rapid requests (limit is 2 per minute)
    const res1 = await GET(makeReq());
    const res2 = await GET(makeReq());
    const res3 = await GET(makeReq());

    expect(res3.status).toBe(429);
    const body = await res3.json();
    expect(body.error).toContain("Çok fazla istek");
  });
});
