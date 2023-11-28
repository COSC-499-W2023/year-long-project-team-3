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

        // Check for required fields
        if (!data || !data.title || typeof data.title !== 'string') {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        if (data.description && typeof data.desciption !== 'string') {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
        }

        // const newSubmissionBox = await prisma.submissionBox.create({
        //     data: {
        //         title: data.title,
        //         ...data,
        //     },
        // })

        {
            return NextResponse.json({ data: data }, { status: 201 })
        }
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
