import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { UserSignUpData } from '@/types/auth/user'

export async function POST(req: Request) {
    try {
        const body: UserSignUpData = await req.json()
        const { email, password } = body

        // If all input fields valid, create the user and store in the database
        if (isSignUpDataValid(body)) {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    accounts: {
                        create: {
                            type: 'bcrypt',
                            provider: 'credentials',
                            providerAccountId: email,
                        },
                    },
                },
            })

            return NextResponse.json(
                {
                    user: newUser,
                },
                { status: 201 }
            )
        } else {
            logger.error(`Cannot create user with ${ email }`)
            return NextResponse.json(
                {
                    error: 'Internal Server Error',
                },
                { status: 500 }
            )
        }
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function isSignUpDataValid(signUpData: UserSignUpData) {
    // TODO: More validation
    return true
}
