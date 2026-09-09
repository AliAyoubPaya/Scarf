import "server-only";

/** Public hosted signup form URL; never put provider API keys here. */
export function getNewsletterSignupUrl(): string | null {
  const configuredUrl = process.env.NEWSLETTER_SIGNUP_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
