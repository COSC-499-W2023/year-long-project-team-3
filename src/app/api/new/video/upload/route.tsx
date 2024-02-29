import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import { VideoUploadData } from '@/types/video/video'
import { FileExtension, fileTypeFromBlob } from 'file-type'
import { User } from '@prisma/client'
import prisma from '@/lib/prisma'
import { uploadVideo } from '@/utils/sendVideo'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const videoData: VideoUploadData = await req.json()

        if (!videoData.title) {
            return NextResponse.json({ error: 'Video title is required' }, { status: 400 })
        }

        if (!videoData.file) {
            return NextResponse.json({ error: 'Video file is required' }, { status: 400 })
        }
        const fileExtension: FileExtension | undefined = (await fileTypeFromBlob(videoData.file))?.ext
        if(!fileExtension || (fileExtension !== 'mov' && fileExtension !== 'mp4')) {
            return NextResponse.json({ error: 'Video must be an mp4 or mov file' }, { status: 400 })
        }

        if(!videoData.description) {
            videoData.description = ''
        }

        if (videoData.blurFace === undefined || videoData.blurFace === null) {
            return NextResponse.json({ error: 'Face blur selection is required' }, { status: 400 })
        }

        const userEmail = session?.user?.email as string
        const user: User = await prisma.user.findUniqueOrThrow({
            where: {
                email: userEmail,
            },
        })

        const video = await uploadVideo(videoData, user, fileExtension)
        // Sending this does not mean the video is process successfully.
        return NextResponse.json({ video: video }, { status: 201 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
