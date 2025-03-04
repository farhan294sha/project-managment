/*
  Warnings:

  - You are about to drop the `UserReaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserReaction" DROP CONSTRAINT "UserReaction_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "UserReaction" DROP CONSTRAINT "UserReaction_userId_fkey";

-- DropTable
DROP TABLE "UserReaction";
