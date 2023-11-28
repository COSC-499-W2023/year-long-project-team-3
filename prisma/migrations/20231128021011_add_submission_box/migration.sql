/*
  Warnings:

  - You are about to drop the column `submittedAt` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubmissionBoxViewPermission" AS ENUM ('owner', 'admin');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "submittedAt";

-- CreateTable
CREATE TABLE "SubmissionBox" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closesAt" TIMESTAMP(3),
    "videoStoreToDate" TIMESTAMP(3),
    "maxVideoLength" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubmissionBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedSubmission" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "submissionBoxId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestedSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedVideo" (
    "videoId" TEXT NOT NULL,
    "requestedSubmissionId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmittedVideo_pkey" PRIMARY KEY ("videoId","requestedSubmissionId")
);

-- CreateTable
CREATE TABLE "SubmissionBoxManager" (
    "userId" TEXT NOT NULL,
    "submissionBoxId" TEXT NOT NULL,
    "viewPermission" "SubmissionBoxViewPermission" NOT NULL,

    CONSTRAINT "SubmissionBoxManager_pkey" PRIMARY KEY ("userId","submissionBoxId")
);

-- CreateIndex
CREATE INDEX "RequestedSubmission_email_idx" ON "RequestedSubmission"("email");

-- CreateIndex
CREATE INDEX "RequestedSubmission_userId_idx" ON "RequestedSubmission"("userId");

-- AddForeignKey
ALTER TABLE "RequestedSubmission" ADD CONSTRAINT "RequestedSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedSubmission" ADD CONSTRAINT "RequestedSubmission_submissionBoxId_fkey" FOREIGN KEY ("submissionBoxId") REFERENCES "SubmissionBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedVideo" ADD CONSTRAINT "SubmittedVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedVideo" ADD CONSTRAINT "SubmittedVideo_requestedSubmissionId_fkey" FOREIGN KEY ("requestedSubmissionId") REFERENCES "RequestedSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionBoxManager" ADD CONSTRAINT "SubmissionBoxManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionBoxManager" ADD CONSTRAINT "SubmissionBoxManager_submissionBoxId_fkey" FOREIGN KEY ("submissionBoxId") REFERENCES "SubmissionBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
