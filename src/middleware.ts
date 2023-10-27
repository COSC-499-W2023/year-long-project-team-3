import { NextResponse, type NextRequest } from 'next/server'
import logger from '@/utils/logger'

export function middleware(request: NextRequest): NextResponse {
    if (request.nextUrl.pathname.startsWith('/api')) {
        logger.info(`API request: ${ request.nextUrl.pathname }`)
        return NextResponse.next()
    }

    return NextResponse.next()
}
