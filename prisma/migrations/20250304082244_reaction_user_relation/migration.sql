/*
  Warnings:

  - You are about to drop the column `commentId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emoji]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropIndex
DROP INDEX "Reaction_userId_commentId_emoji_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "commentId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_CommentReaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserReaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentReaction_AB_unique" ON "_CommentReaction"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentReaction_B_index" ON "_CommentReaction"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserReaction_AB_unique" ON "_UserReaction"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReaction_B_index" ON "_UserReaction"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_emoji_key" ON "Reaction"("emoji");

-- AddForeignKey
ALTER TABLE "_CommentReaction" ADD CONSTRAINT "_CommentReaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentReaction" ADD CONSTRAINT "_CommentReaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserReaction" ADD CONSTRAINT "_UserReaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserReaction" ADD CONSTRAINT "_UserReaction_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
