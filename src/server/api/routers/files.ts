import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { bucketName, s3Client } from "~/utils/s3ClientProvider";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/utils/constant";


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

      if (!ALLOWED_FILE_TYPES.includes(type)) {
        throw new TRPCError({
          message: `file type not accepted ${type}`,
          code: "BAD_REQUEST",
        });
      }

      if (size > MAX_FILE_SIZE) {
        throw new TRPCError({
          message: "only accept max size of 5mb ",
          code: "BAD_REQUEST",
        });
      }

      const command = new PutObjectCommand({
        Key: generateFileName(),
        Bucket: bucketName,
        ContentLength: size,
        ContentType: type,
        ChecksumSHA256: checkSum,
        Metadata: {
          userId: ctx.session.user.id,
        },
      });

      const signUrl = await getSignedUrl(s3Client, command, {
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
