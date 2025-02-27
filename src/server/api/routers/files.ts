import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

const acceptedFileTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const maxFileSize = 1024 * 1024 * 5; // 5mb

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const fileUploadRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        size: z.number(),
        checkSum: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, size, checkSum } = input;

      if (!acceptedFileTypes.includes(type)) {
        throw new TRPCError({
          message: `file type not accepted ${type}`,
          code: "BAD_REQUEST",
        });
      }

      if (size > maxFileSize) {
        throw new TRPCError({
          message: "only accept max size of 5mb ",
          code: "BAD_REQUEST",
        });
      }

      const command = new PutObjectCommand({
        Key: generateFileName(),
        Bucket: "project-management",
        ContentLength: size,
        ContentType: type,
        ChecksumSHA256: checkSum,
        Metadata: {
          userId: ctx.session.user.id,
        },
      });

      const clientS3 = new S3Client({
        region: "ap-south-1",
        forcePathStyle: true,
        endpoint: "http://localhost:9001",
        credentials: {
          accessKeyId: "AKIAIOSFODNN7EXAMPLE", // local s3 keys
          secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        },
      });

      const signUrl = await getSignedUrl(clientS3, command, {
        expiresIn: 60,
      });

      const fileUrl = signUrl.split("?")[0];
      if (!fileUrl) {
        throw new TRPCError({
          message: "Cannot create url",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const file = await ctx.db.file.create({
        data: {
          userId: ctx.session.user.id,
          url: fileUrl,
          type: type.endsWith("pdf") ? "pdf" : "image",
        },
      });
      return { url: signUrl, fileId: file.id };
    }),
});
