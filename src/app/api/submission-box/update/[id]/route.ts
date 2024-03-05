import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function PUT(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to edit a submission box' }, { status: 401 })
        }

        const submissionBoxId = req.nextUrl.pathname.split('/').pop()
        if (!submissionBoxId) {
            return NextResponse.json({ error: 'No submission box id provided' }, { status: 400 })
        }

        const submissionFormBody = await req.formData()
        const title = submissionFormBody.get('title')
        const description = submissionFormBody.get('description')
        const closesAt = submissionFormBody.get('closesAt')

        if (!title || typeof title !== 'string' || title === '') {
            logger.error(`User ${ session.user.email } did not provide a title`)
            return NextResponse.json({ error: 'No title provided' }, { status: 500 })
        }

        if (description !== null && typeof description !== 'string') {
            logger.error('Unexpected description type')
            return NextResponse.json({ error: 'Unexpected description type' }, { status: 500 })
        }

        if (!!closesAt && new Date(closesAt.toString()) < new Date()) {
            logger.error('Date chosen has already past')
            return NextResponse.json({ error: 'Date chosen has already past' }, { status: 500 })
        }

        // Get user id
        const userId = (
            await prisma.user.findUniqueOrThrow({
                where: {
                    email: session.user.email,
                },
                select: {
                    id: true,
                },
            })
        ).id

        const ownedSubmissionBox = await prisma.submissionBoxManager.findUniqueOrThrow({
            where: {
                // eslint-disable-next-line camelcase
                userId_submissionBoxId: {
                    userId: userId,
                    submissionBoxId: submissionBoxId,
                },
            },
            select: {
                viewPermission: true,
            },
        })

        if (ownedSubmissionBox.viewPermission !== 'owner') {
            logger.error(`User ${ userId } does not have permission to modify submission box ${ submissionBoxId }`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updatedSubmissionBox = await prisma.submissionBox.update({
            where: {
                id: submissionBoxId,
            },
            data: {
                title: title,
                description: description,
                closesAt: closesAt ? new Date(closesAt.toString()) : null,
            },
        })
        return NextResponse.json( {submission: updatedSubmissionBox}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
