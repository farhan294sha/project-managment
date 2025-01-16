/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  transpilePackages: ["geist"],

  // Add the rewrites function here
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*", // Match all requests to /api/trpc
        destination:
          "https://g2uucgoiwkqlpmctmq2vwmnv3e0vfted.lambda-url.ap-south-1.on.aws/:path*", // Forward to your backend
      },
    ];
  },
};

export default config;
