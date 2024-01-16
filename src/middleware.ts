import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'

export default withAuth(
    async function middleware(request: NextRequest) {
        // Check if we should redirect when a user's email isn't verified
        const cookies = request.cookies
        const isLoggedIn = cookies.has('next-auth.session-token')
        const protectedPages = ['/dashboard', '/submission-box', '/video', '/api/video', '/api/submission-box', '/api/videos']
        if (
            isLoggedIn &&
            protectedPages.some(page => request.nextUrl.pathname.startsWith(page))
        ) {
            const res = await (await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/verify-email/is-verified', {
                method: 'GET',
                headers: {
                    'cookie': cookies.toString(),
                },
            })).json()
            if (!(res.isVerified ?? false)) {
                const url = request.nextUrl.clone()
                url.pathname = '/verify-email'
                return NextResponse.redirect(url)
            }
        }

        if (request.nextUrl.pathname.startsWith('/api')) {
            logger.info(`API request: ${ request.nextUrl.pathname }`)
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                const protectedPages = ['/dashboard', '/submission-box', '/video', '/api/video', '/api/submission-box', '/api/videos']
                return !(token === null && protectedPages.some((page) => req.nextUrl.pathname.startsWith(page)))
            },
        },
    }
)
