import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { UserSignUpData } from '@/types/auth/user'
import { isEmailUnique, isValidEmail, isValidPassword } from '@/utils/verification'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body: UserSignUpData = await req.json()
        const { email, password } = body

        const isUserSignUpDataValid = isValidEmail(email) && (await isEmailUnique(email))
        if (!isUserSignUpDataValid) {
            return NextResponse.json({ error: 'The input email is not valid' }, { status: 400 })
        }
        if (!isValidPassword(password)) {
            return NextResponse.json({ error: 'The input password is not valid' }, { status: 400 })
        }
        if (!(await isEmailUnique(email))) {
            return NextResponse.json({ error: 'This email address is already in use' }, { status: 400 })
        }

        // TODO: Put rounds (10) in env file and change its value
        const hashedPassword = await hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                accounts: {
                    create: {
                        type: 'bcrypt',
                        provider: 'credentials',
                        // TODO: This should be changed to an id instead of an email
                        providerAccountId: email,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            {
                user: newUser,
            },
            { status: 201 }
        )
    } catch (err) {
        const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
        logger.error(errMessage)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
