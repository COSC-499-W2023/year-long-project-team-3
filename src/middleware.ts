import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'

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
                return !(token === null && req.nextUrl.pathname.startsWith('/dashboard'))
            },
        },
    }
)
