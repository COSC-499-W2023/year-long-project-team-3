import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'

export default withAuth(
    async function middleware(request: NextRequest) {
        console.log('Hello there')

        const cookies = request.headers.get('cookie')
        const requestHeaders: HeadersInit = new Headers()
        cookies?.split(';').map(cookie => {
            const [key, value] = cookie.trim().split('=')
            requestHeaders.set(key, value)
        })
        requestHeaders.forEach((a, b) => {
            console.log(`COOKIE: ${ a } = ${ b }`)
        })

        const res = await (await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/verify-email/is-verified', {
            method: 'GET',
            headers: requestHeaders,
        })).json()
        console.log(res)

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
