import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { isSignUpDataValid } from '@/utils/verification'
import logger from '@/utils/logger'
import { UserSignUpData } from '@/types/auth/user'

export async function POST(req: Request) {
    try {
        const body: UserSignUpData = await req.json()
        const { email, password } = body

        // If all input fields valid, create the user and store in the database
        const hashedPassword = await hash(password, 10)
        if (await isSignUpDataValid(body)) {
            const userAccount = await prisma.account.create({
                data: {
                    userId: '',
                    type: 'bcrypt',
                    provider: 'credentials',
                    providerAccountId: '',
                },
            })

            // TODO: Check if new account associate with any user
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            })

            // Map account to user
            await prisma.account.update({
                where: {
                    id: userAccount.id,
                },
                data: {
                    userId: newUser.id,
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
        logger.info
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
