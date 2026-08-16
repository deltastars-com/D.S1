import { beforeEach, describe, expect, it, vi } from "vitest";

const upsertVerifiedCustomer = vi.fn();

vi.mock("./_core/env", () => ({
  ENV: {
    authenticaApiKey: "test-authentica-key",
    authenticaApiUrl: "https://api.authentica.sa",
  },
}));
vi.mock("./db", () => ({ upsertVerifiedCustomer }));

const { registerOtpRoutes } = await import("./otp");

type Handler = (req: any, res: any) => Promise<unknown>;

function setupRoutes() {
  const handlers = new Map<string, Handler>();
  const app = {
    post(path: string, handler: Handler) {
      handlers.set(path, handler);
    },
  };
  registerOtpRoutes(app as any);
  return handlers;
}

function responseMock() {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return response;
}

describe("Authentica OTP routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    upsertVerifiedCustomer.mockReset();
  });

  it("sends a normalized Saudi phone number through Authentica", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    const handlers = setupRoutes();
    const res = responseMock();

    await handlers.get("/api/otp/send")!({ body: { phone: "0501234567" } }, res);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.authentica.sa/api/v2/send-otp",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Authorization": "test-authentica-key",
        }),
        body: JSON.stringify({ method: "sms", phone: "+966501234567" }),
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("does not accept an invalid OTP or report success when Authentica rejects it", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ verified: false }), { status: 200 }),
    );
    const handlers = setupRoutes();
    const res = responseMock();

    await handlers.get("/api/otp/verify")!({ body: { phone: "+966501234568", code: "000000" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Invalid or expired OTP" });
  });

  it("persists the verified customer before returning a successful verification", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ verified: true }), { status: 200 }),
    );
    upsertVerifiedCustomer.mockResolvedValue({ id: 42, phone: "+966501234569", role: "user", verified: true });
    const handlers = setupRoutes();
    const res = responseMock();

    await handlers.get("/api/otp/verify")!({ body: { phone: "+966501234569", code: "123456" } }, res);

    expect(upsertVerifiedCustomer).toHaveBeenCalledWith("+966501234569");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      verified: true,
      user: { id: 42, phone: "+966501234569", role: "user", verified: true },
    });
  });

  it("rejects malformed phone numbers before making an external request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const handlers = setupRoutes();
    const res = responseMock();

    await handlers.get("/api/otp/send")!({ body: { phone: "123" } }, res);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
