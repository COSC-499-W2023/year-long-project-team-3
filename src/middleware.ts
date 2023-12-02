import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'

export default withAuth(
    function middleware(request: NextRequest) {
        if (request.nextUrl.pathname.startsWith('/api')) {
            logger.info(`API request: ${ request.nextUrl.pathname }`)
            return NextResponse.next()
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                const protectedPages = ['/dashboard', '/submission-box', '/video', '/api/video']
                return !(token === null && protectedPages.some((page) => req.nextUrl.pathname.startsWith(page)))
            },
        },
    }
)
