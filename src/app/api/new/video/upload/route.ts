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
        const videoFormBody = await req.formData()
        const title = videoFormBody.get('title')
        const description = videoFormBody.get('description')
        const file = videoFormBody.get('file')
        const blurFace = videoFormBody.get('blurFace')
        if (!title || typeof title !== 'string') {
            return NextResponse.json({ error: 'Video title is required' }, { status: 400 })
        }
        if (!isVideoValidType(file)) {
            return NextResponse.json({ error: 'Video file is required' }, { status: 400 })
        }
        const fileExtension: FileExtension | undefined = (await fileTypeFromBlob(file))?.ext
        if(!fileExtension || (fileExtension !== 'mov' && fileExtension !== 'mp4')) {
            return NextResponse.json({ error: 'Video must be an mp4 or mov file' }, { status: 400 })
        }

        if (blurFace === undefined || blurFace === null || typeof blurFace !== 'string') {
            return NextResponse.json({ error: 'Face blur selection is required' }, { status: 400 })
        }

        if(typeof description !== 'string') {
            return NextResponse.json({ error: 'Description must be a string' }, { status: 400 })
        }
        const isFaceBlur = blurFace.toLowerCase() === 'true' ? true : blurFace.toLowerCase() === 'false' ? false : undefined
        if (isFaceBlur === undefined)
        {return NextResponse.json({ error: 'Face blur selection must be a boolean value' }, { status: 400 })}

        const videoData: VideoUploadData = {
            title: title,
            description: description ? description : '',
            file: file,
            blurFace: isFaceBlur,
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

function isVideoValidType(video: FormDataEntryValue | null): video is File {
    return video !== null && video.constructor.name === 'File'
}
