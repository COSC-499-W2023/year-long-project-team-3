import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import sendVideo from '@/utils/sendVideo'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // get a file from req
        const session = await getSession()
        if (!session || !session.user?.email) {
            NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
        }

        const userEmail = session?.user?.email as string
        const user: User = await prisma.user.findUniqueOrThrow({
            where: {
                email: userEmail,
            },
        })

        const body: { file: File } = await req.json()
        const { file } = body

        const newVideo = await sendVideo(file, user)

        return NextResponse.json({ video: newVideo }, { status: 201 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
