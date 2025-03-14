// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "projectmanagementapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      region: "ap-south-1",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("projectManagment", {
      access: "public",
      transform: {
        policy: (args) => {
          args.policy = sst.aws.iamEdit(args.policy, (policy) => {
            policy.Statement.push({
              Effect: "Allow",
              Action: "s3:PutObject",
              Principal: "*",
              Resource: $interpolate`arn:aws:s3:::${args.bucket}/*`,
            });
          });
        },
      },

      cors: {
        allowHeaders: ["*"],
        maxAge: "1 day",
        allowOrigins: ["https://d3tptrrryiv8m8.cloudfront.net"],
        allowMethods: ["PUT", "GET"],
      },
    });

    const DATABASE_URL = new sst.Secret("DATABASE_URL");
    const DIRECT_URL = new sst.Secret("DIRECT_URL");
    const NEXTAUTH_SECRET = new sst.Secret("NEXTAUTH_SECRET");
    const NEXTAUTH_URL = new sst.Secret("NEXTAUTH_URL");
    const GITHUB_ID = new sst.Secret("GITHUB_ID");
    const GITHUB_SECRET = new sst.Secret("GITHUB_SECRET");
    const NODE_ENV = new sst.Secret("NODE_ENV");

    new sst.aws.Nextjs("MyWeb", {
      link: [bucket, DATABASE_URL],
      environment: {
        NEXTAUTH_SECRET: NEXTAUTH_SECRET.value,
        NEXTAUTH_URL: NEXTAUTH_URL.value,
        GITHUB_ID: GITHUB_ID.value,
        GITHUB_SECRET: GITHUB_SECRET.value,
        DATABASE_URL: DATABASE_URL.value,
        DIRECT_URL: DIRECT_URL.value,
        NODE_ENV: NODE_ENV.value,
      },
    });
  },
});
