// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "projectmanagementapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const DATABASE_URL = new sst.Secret("DATABASE_URL");
    const DIRECT_URL = new sst.Secret("DIRECT_URL");
    const NEXTAUTH_SECRET = new sst.Secret("NEXTAUTH_SECRET");
    const NEXTAUTH_URL = new sst.Secret("NEXTAUTH_URL");
    const GITHUB_ID = new sst.Secret("GITHUB_ID");
    const GITHUB_SECRET = new sst.Secret("GITHUB_SECRET");

    const vpc = new sst.aws.Vpc("MyVpc", { nat: "managed" });
    new sst.aws.Nextjs("MyWeb", {
      environment: {
        NEXTAUTH_SECRET: NEXTAUTH_SECRET.value,
        NEXTAUTH_URL: NEXTAUTH_URL.value,
        GITHUB_ID: GITHUB_ID.value,
        GITHUB_SECRET: GITHUB_SECRET.value,
      },
    });
    const trpc = new sst.aws.Function("Trpc", {
      vpc,
      url: {
        cors: {
          allowOrigins: ["http://localhost:3000"], // Allow requests from your frontend
          allowCredentials: true, // Allow credentials (cookies, authorization headers)}, // Enable CORS
        },
      },
      handler: "src/server/api/root.handler",
      timeout: `${30} second`,
      environment: {
        DATABASE_URL: DATABASE_URL.value,
        DIRECT_URL: DIRECT_URL.value,
        NEXTAUTH_SECRET: NEXTAUTH_SECRET.value,
      },
      nodejs: {
        install: ["@prisma/client", "prisma"], // Ensure Prisma dependencies are installed
      },
      copyFiles: [{ from: "node_modules/@prisma/client/" }],
    });
    return {
      api: trpc.url,
    };
  },
});
