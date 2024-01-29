import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { getEmailRegex } from '@/utils/verification'
import logger from '@/utils/logger'
import { sendSubmissionInvitations } from '@/utils/emails/submissionInvitation'

export type SubmissionBoxCreateData = {
    title: string
    description?: string
    closesAt?: Date
    requestedEmails: string[]
    videoStoreToDate?: Date
    maxVideoLength?: number
    isPublic?: boolean
}

function validateRequest(data: any): data is SubmissionBoxCreateData {
    if (!data) {
        return false
    }
    if (!data.title || typeof data.title != 'string') {
        return false
    }
    if (!data.requestedEmails || !Array.isArray(data.requestedEmails)) {
        return false
    }
    const emailRegex = getEmailRegex()
    if (
        data.requestedEmails.some(
            (x: any) => typeof x !== 'string' || !emailRegex.test(x)
        )
    ) {
        return false
    }
    if (data.description && typeof data.description !== 'string') {
        return false
    }
    if (data.closesAt && isNaN(Date.parse(data.closesAt))) {
        return false
    }
    if (data.videoStoreToDate && isNaN(Date.parse(data.closesAt))) {
        return false
    }
    if (data.maxVideoLength && isNaN(parseFloat(data.maxVideoLength))) {
        return false
    }
    // noinspection RedundantIfStatementJS
    if (
        data.isPublic &&
        !(typeof data.isPublic === 'boolean' || data.isPublic === 'true' || data.isPublic === 'false')
    ) {
        return false
    }
    return true
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const reqData = await req.json().catch(() => {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        })
        if (!validateRequest(reqData)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        const owner = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user?.email!,
            },
            select: {
                id: true,
                email: true,
                emailVerified: true,
            },
        })

        if (!owner.emailVerified) {
            return NextResponse.json({ error: 'Your email must be verified to create a submission box' }, { status: 401 })
        }

        // Create submission box
        const newSubmissionBox = await prisma.submissionBox.create({
            data: {
                title: reqData.title,
                description: reqData.description,
                // Make the date field an actual date
                closesAt: reqData.closesAt ? new Date(reqData.closesAt) : undefined,
                videoStoreToDate: reqData.videoStoreToDate,
                maxVideoLength: reqData.maxVideoLength,
                isPublic: reqData.isPublic,
            },
        })
        const submissionBoxId = newSubmissionBox.id

        // Add logged-in user as manager
        await prisma.submissionBoxManager.create({
            data: {
                userId: owner.id,
                viewPermission: 'owner',
                submissionBoxId: submissionBoxId,
            },
        })

        // Get any users that already exist
        const users =
            reqData.requestedEmails.length === 0
                ? []
                : await prisma.user.findMany({
                    select: {
                        id: true,
                        email: true,
                    },
                    where: {
                        email: {
                            in: reqData?.requestedEmails,
                        },
                    },
                })

        // Convert the array of users to an object for faster lookups
        const existingUsers = users.reduce((userRecord: Record<string, string>, user) => {
            userRecord[user.email] = user.id
            return userRecord
        }, {})

        // Create submission requests
        await prisma.requestedSubmission.createMany({
            data: reqData.requestedEmails.map((email) => {
                return {
                    email: email,
                    userId: existingUsers[email] ?? null,
                    submissionBoxId: submissionBoxId,
                }
            }),
        })

        // Send email invitations
        if (reqData.requestedEmails.length > 0) {
            await sendSubmissionInvitations(reqData.requestedEmails, owner.email, newSubmissionBox)
        }

        return NextResponse.json(newSubmissionBox, { status: 201 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
