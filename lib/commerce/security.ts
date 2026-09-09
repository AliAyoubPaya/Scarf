import { createHmac, timingSafeEqual } from "node:crypto";

export function equalSecret(actual: string, expected: string) {
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return b.length >= 32 && a.length === b.length && timingSafeEqual(a, b);
}
export function verifyWebhook(body: string, signature: string, secret: string) {
  if (secret.length < 32) return false;
  return equalSecret(signature, createHmac("sha256", secret).update(body).digest("base64"));
}
export function sameOrigin(request: Request) { return request.headers.get("origin") === new URL(request.url).origin; }
export function validQuantity(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 99; }
