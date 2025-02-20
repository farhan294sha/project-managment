import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Resource } from "sst";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const fileUploadRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure.mutation(async () => {
    const command = new PutObjectCommand({
      Key: "samplefile",
      Bucket: Resource.projectManagment.name!,
    });
    const signUrl = await getSignedUrl(new S3Client({}), command, {
      expiresIn: 60,
    });
    return { url: signUrl };
  }),
});