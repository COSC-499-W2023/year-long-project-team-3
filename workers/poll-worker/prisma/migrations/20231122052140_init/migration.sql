-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "ownerId" TEXT,
    "s3Key" TEXT,
    "isCloudProcessed" BOOLEAN NOT NULL DEFAULT false,
    "thumbnail" TEXT,
    "rawVideoUrl" TEXT,
    "processedVideoUrl" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoWhitelist" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoWhitelistedUser" (
    "whitelistedVideoId" TEXT NOT NULL,
    "whitelistedUserId" TEXT NOT NULL,
    "whitelistedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whitelistedExpiredAt" TIMESTAMP(3),

    CONSTRAINT "VideoWhitelistedUser_pkey" PRIMARY KEY ("whitelistedVideoId","whitelistedUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoWhitelist_videoId_key" ON "VideoWhitelist"("videoId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWhitelist" ADD CONSTRAINT "VideoWhitelist_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWhitelistedUser" ADD CONSTRAINT "VideoWhitelistedUser_whitelistedVideoId_fkey" FOREIGN KEY ("whitelistedVideoId") REFERENCES "VideoWhitelist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWhitelistedUser" ADD CONSTRAINT "VideoWhitelistedUser_whitelistedUserId_fkey" FOREIGN KEY ("whitelistedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
