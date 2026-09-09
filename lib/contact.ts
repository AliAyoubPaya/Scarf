import "server-only";

/** Public business address only. No email provider credentials are exposed. */
export function getContactEmail(): string | null {
  const email = process.env.CONTACT_EMAIL?.trim();
  return email && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) ? email : null;
}
