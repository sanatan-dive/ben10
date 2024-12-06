-- CreateTable
CREATE TABLE "UserAlienInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "posts" INTEGER NOT NULL,
    "alienName" TEXT NOT NULL,
    "alienTitle" TEXT NOT NULL,
    "alienType" TEXT NOT NULL,
    "alienPower" TEXT NOT NULL,
    "alienDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAlienInfo_pkey" PRIMARY KEY ("id")
);
