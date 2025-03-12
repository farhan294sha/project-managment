import { S3Client } from "@aws-sdk/client-s3";
import { Resource } from "sst/resource";
import { env } from "~/env";

const isDev = env.NODE_ENV === "development";

const S3ClientConfig = isDev
  ? {
      region: "ap-south-1",
      forcePathStyle: true,
      endpoint: "http://localhost:9001",
      credentials: {
        accessKeyId: "AKIAIOSFODNN7EXAMPLE", // local s3 keys (https://s3ninja.net/)
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      },
    }
  : {};

export const s3Client = new S3Client(S3ClientConfig);

export const bucketName = isDev
  ? "projectmanagment"
  : Resource.projectManagment.name;
