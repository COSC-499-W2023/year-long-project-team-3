import {NextRequest, NextResponse} from 'next/server'
import logger from '@/utils/logger'
import {getServerSession} from 'next-auth'


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
        }

        return NextResponse.json({ data: 'Wow, such working'}, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
