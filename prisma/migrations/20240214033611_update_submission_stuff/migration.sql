/*
  Warnings:

  - A unique constraint covering the columns `[email,submissionBoxId]` on the table `RequestedSubmission` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerId` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_ownerId_fkey";

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RequestedSubmission_email_submissionBoxId_key" ON "RequestedSubmission"("email", "submissionBoxId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
