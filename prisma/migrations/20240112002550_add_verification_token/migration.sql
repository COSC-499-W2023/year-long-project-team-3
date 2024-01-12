-- CreateTable
CREATE TABLE "RequestedEmailVerification" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "requestTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RequestedEmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestedEmailVerification_token_key" ON "RequestedEmailVerification"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RequestedEmailVerification_userId_key" ON "RequestedEmailVerification"("userId");

-- CreateIndex
CREATE INDEX "RequestedEmailVerification_token_idx" ON "RequestedEmailVerification"("token");

-- AddForeignKey
ALTER TABLE "RequestedEmailVerification" ADD CONSTRAINT "RequestedEmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
