import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const adminSecret = process.env.VITE_ADMIN_BOOTSTRAP_PASSWORD;
const developerSecret = process.env.VITE_DEV_BOOTSTRAP_PASSWORD;

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  server = createServer((request, response) => {
    if (request.url !== "/health/bootstrap" || request.method !== "GET") {
      response.statusCode = 404;
      response.end();
      return;
    }

    const supplied = request.headers["x-bootstrap-secret"];
    const value = Array.isArray(supplied) ? supplied[0] : supplied;
    const valid = value === adminSecret || value === developerSecret;
    response.statusCode = valid ? 200 : 401;
    response.end(valid ? "ok" : "unauthorized");
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Bootstrap test server did not start");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

describe("bootstrap dashboard secrets", () => {
  it("validates both configured secrets through a lightweight HTTP endpoint", async () => {
    expect(adminSecret).toBeTruthy();
    expect(developerSecret).toBeTruthy();
    expect(adminSecret).not.toBe(developerSecret);

    for (const secret of [adminSecret, developerSecret]) {
      const response = await fetch(`${baseUrl}/health/bootstrap`, {
        headers: { "x-bootstrap-secret": secret! },
      });
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("ok");
    }
  });
});
