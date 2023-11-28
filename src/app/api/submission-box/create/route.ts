import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get request data
        const formData = await req.formData()
        let data = Object.fromEntries(formData.entries())

        // Validate request fields
        if (!data || !data.title || typeof data.title !== 'string') {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        if (!data.invites) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        if (data.description && typeof data.desciption !== 'string') {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        if (data.closingDate && typeof data.closingDate !== 'string') {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        // Create submusion box
        const newSubmissionBox = await prisma.submissionBox.create({
            data: {
                title: data.title,
                ...data,
            },
        })
        const submissionBoxId = newSubmissionBox.id

        // Create submission requests
        const requests = await prisma.requestedSubmission.createMany({
            data: (data.invites as string[]).map((email) => {
                return { email: email, submissionBoxId: submissionBoxId }
            }),
        })

        // Add logged-in user as manager
        const ownerUserId = prisma.user.findUniqueOrThrow({
            where: {
                email: session.user?.email!,
            },
        })

        return NextResponse.json({ data: data }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
