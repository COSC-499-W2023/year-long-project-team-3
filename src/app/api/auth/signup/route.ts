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
        if (!isValidEmail(email) || !(await isEmailUnique(email))) {
            return NextResponse.json({ error: 'The input email is not valid' }, { status: 400 })
        }
        if (!isValidPassword(password)) {
            return NextResponse.json({ error: 'The input password is not valid' }, { status: 400 })
        }
        if (!(await isEmailUnique(email))) {
            return NextResponse.json({ error: 'This email address is already in use' }, { status: 400 })
        }

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
        })
        if (newUser != null) {
            return NextResponse.json(
                {
                    user: newUser,
                },
                { status: 201 }
            )
        } else {
            return NextResponse.json({ error: 'Unable to create user ' }, { status: 500 })
        }
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
