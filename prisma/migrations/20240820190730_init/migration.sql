-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "HighScore" BIGINT NOT NULL DEFAULT 0,
    "ProfilePic" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
