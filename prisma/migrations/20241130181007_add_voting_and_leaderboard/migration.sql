/*
  Warnings:

  - A unique constraint covering the columns `[voterId,votedUserId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_votedUserId_key" ON "Vote"("voterId", "votedUserId");
