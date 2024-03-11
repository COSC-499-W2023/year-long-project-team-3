import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function PUT(req: NextRequest): Promise<NextResponse> {
    // This api works as the backend for updating a submission boxes title, description and closing date in the database
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to edit a submission box' }, { status: 401 })
        }

        // Get the specific submission box
        const submissionBoxId = req.nextUrl.pathname.split('/').pop()
        if (!submissionBoxId) {
            return NextResponse.json({ error: 'No submission box id provided' }, { status: 400 })
        }

        // Unpack the form information that the user inputted
        const submissionFormBody = await req.formData()
        const title = submissionFormBody.get('title')
        const description = submissionFormBody.get('description')
        const closesAt = submissionFormBody.get('closesAt')

        // Determine if the title is a valid string and is not empty
        if (!title || typeof title !== 'string' || title === '') {
            logger.error(`User ${ session.user.email } did not provide a title when trying to update the submission box title, Update submission box API throw`)
            return NextResponse.json({ error: 'No title provided' }, { status: 400 })
        }

        // Determine if the description is a valid string or is empty
        if (description !== null && typeof description !== 'string') {
            logger.error('Unexpected description type when user tried to update the submission box description, Update submission box API throw')
            return NextResponse.json({ error: 'Unexpected description type' }, { status: 400 })
        }

        // If there is a closing date, determine if the date is not already past
        if (!!closesAt && new Date(closesAt.toString()) < new Date()) {
            logger.error('Date the user selected to update the closesAt time for submission box has past, Update submission box API throw')
            return NextResponse.json({ error: 'Date chosen has already past' }, { status: 400 })
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

        // Get the submission box being modifyed in the database
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

        // Determine if user has permission to modify submission details
        if (ownedSubmissionBox.viewPermission !== 'owner') {
            logger.error(`User ${ userId } does not have permission to modify submission box ${ submissionBoxId }, Update submission box API throw`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Finally, update the fields in the database
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
