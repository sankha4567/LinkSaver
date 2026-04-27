// `domain` must be set on the Convex backend, NOT just `.env.local`.
// Run: `npx convex env set CLERK_FRONTEND_API_URL https://your-app.clerk.accounts.dev`
// If unset at deploy time, every `ctx.auth.getUserIdentity()` silently returns null.
const domain = process.env.CLERK_FRONTEND_API_URL;
if (!domain) {
  throw new Error(
    "CLERK_FRONTEND_API_URL is not set on the Convex backend. " +
      "Run: npx convex env set CLERK_FRONTEND_API_URL <your-clerk-frontend-api-url>",
  );
}

const authConfig = {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
