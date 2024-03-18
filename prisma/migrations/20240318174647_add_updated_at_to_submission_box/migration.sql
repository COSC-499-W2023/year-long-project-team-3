/*
  Warnings:

  - Added the required column `updatedAt` to the `SubmissionBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmissionBox" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
