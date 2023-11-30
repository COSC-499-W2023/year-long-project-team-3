import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { getEmailRegex } from '@/utils/verification'

interface FormValues {
    title: string
    description?: string | undefined
    closingDate?: Date | undefined
    requestedEmails: string[]
}

function validateRequest(data: any): data is FormValues {
    if (!data) {
        return false
    }
    if (!data.title || typeof data.title != 'string') {
        return false
    }
    if (!data.requestedEmails) {
        return false
    } else {
        try {
            const emailRegex = getEmailRegex()
            const hasNonStringEmail = data.requestedEmails.some((x: any) => !emailRegex.test(x))
            if (hasNonStringEmail) {
                return false
            }
        } catch (err) {
            return false
        }
    }
    if (data.description && typeof data.description != 'string') {
        return false
    }
    return !(data.closingDate && isNaN(Date.parse(data.closingDate)))
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const reqData = await req.json()
        if (!validateRequest(reqData)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        // Make the date field an actual date
        if (reqData.closingDate) {
            reqData.closingDate = new Date(reqData.closingDate)
        }

        // Create submission box
        const newSubmissionBox = await prisma.submissionBox.create({
            data: {
                title: reqData.title,
                description: reqData.description ?? null,
                closesAt: reqData.closingDate ?? null,
            },
        })
        const submissionBoxId = newSubmissionBox.id

        // Get any users that already exist
        let existingUsers: Record<string, string> = {}
        if (reqData.requestedEmails.length > 0) {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                },
                where: {
                    email: {
                        in: reqData.requestedEmails,
                    },
                },
            })

            // Convert the array of users to an object for faster lookups
            existingUsers = users.reduce((dict: Record<string, string>, user) => {
                dict[user.email] = user.id
                return dict
            }, {})
        }

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

        // Add logged-in user as manager
        const owner = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user?.email!,
            },
        })

        await prisma.submissionBoxManager.create({
            data: {
                userId: owner.id,
                viewPermission: 'owner',
                submissionBoxId: submissionBoxId,
            },
        })

        return NextResponse.json(newSubmissionBox, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' + err }, { status: 500 })
    }
}
