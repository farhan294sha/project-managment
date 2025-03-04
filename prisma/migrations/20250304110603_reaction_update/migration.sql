/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the `_CommentReaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserReaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `commentId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CommentReaction" DROP CONSTRAINT "_CommentReaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentReaction" DROP CONSTRAINT "_CommentReaction_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserReaction" DROP CONSTRAINT "_UserReaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserReaction" DROP CONSTRAINT "_UserReaction_B_fkey";

-- DropIndex
DROP INDEX "Reaction_emoji_key";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "commentId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("userId", "commentId", "emoji");

-- DropTable
DROP TABLE "_CommentReaction";

-- DropTable
DROP TABLE "_UserReaction";

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
