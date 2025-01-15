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

    const vpc = new sst.aws.Vpc("MyVpc", { nat: "managed" });
    new sst.aws.Nextjs("MyWeb");
    const trpc = new sst.aws.Function("Trpc", {
      vpc,
      url: {
        cors: true, // Enable CORS
      },
      handler: "src/server/api/root.handler",
      timeout: `${30} second`,
      environment: {
        DATABASE_URL: DATABASE_URL.value,
        DIRECT_URL: DIRECT_URL.value,
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
