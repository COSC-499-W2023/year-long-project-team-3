import logger from '@/utils/logger'
import sendVideo from '@/utils/sendVideo'
import prisma from '@/lib/prisma'
import { type User, type Video } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
        }

        const body = await req.formData()
        const uploadedVideo = body.get('video')
        if (!isVideoValidType(uploadedVideo)) {
            return NextResponse.json({ error: 'The input video is not valid' }, { status: 400 })
        }

        const userEmail = session?.user?.email as string
        const user: User = await prisma.user.findUniqueOrThrow({
            where: {
                email: userEmail,
            },
        })

        const newVideo: Video = await sendVideo(uploadedVideo, user)

        // Sending this does not mean the video is process successfully.
        return NextResponse.json({ video: newVideo }, { status: 201 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function isVideoValidType(video: FormDataEntryValue | null): video is File {
    return video !== null && video instanceof globalThis.File
}
