-- CreateTable
CREATE TABLE "UserReaction" (
    "userId" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,

    CONSTRAINT "UserReaction_pkey" PRIMARY KEY ("userId","reactionId")
);

-- AddForeignKey
ALTER TABLE "UserReaction" ADD CONSTRAINT "UserReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReaction" ADD CONSTRAINT "UserReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
