/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserAlienInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserAlienInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAlienInfo" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAlienInfo_userId_key" ON "UserAlienInfo"("userId");

-- AddForeignKey
ALTER TABLE "UserAlienInfo" ADD CONSTRAINT "UserAlienInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
