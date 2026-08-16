import type { Express, Request, Response } from "express";
import { ENV } from "./_core/env";
import { upsertVerifiedCustomer } from "./db";

const PHONE_PATTERN = /^\+9665\d{8}$/;
const CODE_PATTERN = /^\d{6}$/;
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = 60_000;
const requestWindows = new Map<string, { count: number; resetAt: number }>();

function normalizePhone(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("9665") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("05") && digits.length === 10) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `+966${digits}`;
  return String(value ?? "").trim();
}

function allowRequest(key: string): boolean {
  const now = Date.now();
  const current = requestWindows.get(key);
  if (!current || current.resetAt <= now) {
    requestWindows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

async function callAuthentica(path: string, body: Record<string, unknown>) {
  if (!ENV.authenticaApiKey) {
    throw new Error("Authentica is not configured");
  }

  const response = await fetch(`${ENV.authenticaApiUrl}/api/v2/${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Authorization": ENV.authenticaApiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  const payload = await response.json().catch(() => ({
    success: false,
    error: "Invalid response from Authentica",
  }));

  return { response, payload };
}

function clientError(res: Response, status: number, error: string) {
  return res.status(status).json({ success: false, error });
}

export function registerOtpRoutes(app: Express) {
  app.post("/api/otp/send", async (req: Request, res: Response) => {
    const phone = normalizePhone(req.body?.phone);
    if (!PHONE_PATTERN.test(phone)) {
      return clientError(res, 400, "Invalid Saudi phone number");
    }
    if (!allowRequest(`send:${phone}`)) {
      return clientError(res, 429, "Too many OTP requests; try again later");
    }
    if (!ENV.authenticaApiKey) {
      return clientError(res, 503, "OTP service is not configured");
    }

    try {
      const { response, payload } = await callAuthentica("send-otp", {
        method: "sms",
        phone,
        ...(process.env.AUTHENTICA_TEMPLATE_ID
          ? { template_id: Number(process.env.AUTHENTICA_TEMPLATE_ID) }
          : {}),
      });
      if (!response.ok || payload?.success === false) {
        return clientError(res, response.status || 502, "OTP delivery failed");
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("[OTP] Authentica send failed", error instanceof Error ? error.message : "unknown error");
      return clientError(res, 502, "OTP delivery failed");
    }
  });

  app.post("/api/otp/verify", async (req: Request, res: Response) => {
    const phone = normalizePhone(req.body?.phone);
    const code = String(req.body?.code ?? "").trim();
    if (!PHONE_PATTERN.test(phone) || !CODE_PATTERN.test(code)) {
      return clientError(res, 400, "Invalid OTP request");
    }
    if (!allowRequest(`verify:${phone}`)) {
      return clientError(res, 429, "Too many verification attempts; try again later");
    }
    if (!ENV.authenticaApiKey) {
      return clientError(res, 503, "OTP service is not configured");
    }

    try {
      const { response, payload } = await callAuthentica("verify-otp", { phone, otp: code });
      const verified = response.ok && payload?.verified === true;
      if (!verified) return clientError(res, 400, "Invalid or expired OTP");

      // Do not report a successful login until the verified customer is persisted.
      const user = await upsertVerifiedCustomer(phone);
      return res.status(200).json({
        success: true,
        verified: true,
        user: { id: user.id, phone, role: user.role, verified: user.verified },
      });
    } catch (error) {
      console.error("[OTP] Authentica verify or persistence failed", error instanceof Error ? error.message : "unknown error");
      return clientError(res, 503, "OTP verification could not be completed");
    }
  });
}
