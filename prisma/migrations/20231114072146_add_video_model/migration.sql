-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoWhitelist" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoId" TEXT,

    CONSTRAINT "VideoWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToVideoWhitelist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoWhitelist_videoId_key" ON "VideoWhitelist"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVideoWhitelist_AB_unique" ON "_UserToVideoWhitelist"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVideoWhitelist_B_index" ON "_UserToVideoWhitelist"("B");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWhitelist" ADD CONSTRAINT "VideoWhitelist_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideoWhitelist" ADD CONSTRAINT "_UserToVideoWhitelist_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideoWhitelist" ADD CONSTRAINT "_UserToVideoWhitelist_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoWhitelist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
