function normalizeOrigin(value: string): string {
  return value.replace(/\/$/u, "");
}

export const siteOrigin = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_ORIGIN
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
