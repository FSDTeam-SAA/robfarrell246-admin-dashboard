// Vercel serves the dashboard over HTTPS, including preview deployments.
export const useSecureAuthCookies =
  process.env.VERCEL === "1" ||
  process.env.NEXTAUTH_URL?.startsWith("https://") === true;
