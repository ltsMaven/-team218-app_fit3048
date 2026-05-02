import { Auth0Client } from "@auth0/nextjs-auth0/server";

function getAppBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.APP_BASE_URL;
}

export const hasAuth0Config = Boolean(
  process.env.AUTH0_DOMAIN &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_SECRET &&
    (process.env.AUTH0_CLIENT_SECRET ||
      process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY)
);

export const auth0 = hasAuth0Config
  ? new Auth0Client({
      appBaseUrl: getAppBaseUrl(),
    })
  : null;
