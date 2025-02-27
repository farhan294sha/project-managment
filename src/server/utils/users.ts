import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
/**
 * Validates and retrieves users by email addresses
 * @param emails Array of email addresses to validate
 * @param throwOnMissing Whether to throw an error if users are missing
 * @returns Object containing user IDs and optional missing emails
 */
export async function validateUsersByEmail(
  db: PrismaClient,
  emails: string[],
  throwOnMissing = true
): Promise<{
  userIds: { id: string }[];
  missingEmails?: string[];
}> {
  if (!emails.length) return { userIds: [] };

  const users = await db.user.findMany({
    where: { email: { in: emails } },
    select: { email: true, id: true },
  });

  const foundEmails = users.map((user) => user.email);
  const missingEmails = emails.filter((email) => !foundEmails.includes(email));

  if (missingEmails.length > 0 && throwOnMissing) {
    throw new TRPCError({
      message: `Users not found: ${missingEmails.join(", ")}`,
      code: "NOT_FOUND",
    });
  }

  return {
    userIds: users.map((user) => {
      return { id: user.id };
    }),
    missingEmails: missingEmails.length > 0 ? missingEmails : undefined,
  };
}
