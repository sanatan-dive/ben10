/*
  Warnings:

  - You are about to drop the `UserAlienInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `alienDescription` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alienName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alienPower` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alienTitle` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alienType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posts` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAlienInfo" DROP CONSTRAINT "UserAlienInfo_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alienDescription" TEXT NOT NULL,
ADD COLUMN     "alienName" TEXT NOT NULL,
ADD COLUMN     "alienPower" TEXT NOT NULL,
ADD COLUMN     "alienTitle" TEXT NOT NULL,
ADD COLUMN     "alienType" TEXT NOT NULL,
ADD COLUMN     "followers" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "posts" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserAlienInfo";
