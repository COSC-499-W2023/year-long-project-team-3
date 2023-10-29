import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailVerification, passwordVerification, passwordMatchVerification, emailExistsInDatabase } from '@/utils/verification'
export async function POST(req: Request) {
    try {
        // Collect information from page
        const body = await req.json()
        // Deconstruct request
        const { email, password, passwordCheck } = body

        // If all input fields valid, create the user and store in the database
        if (emailVerification(email) && passwordVerification(password) && passwordMatchVerification(password, passwordCheck) && await emailExistsInDatabase(email)) {
            const newUser = await prisma.user
                .create({
                    data: {
                        email,
                        password,
                    },
                })
                .catch(() => {
                    console.log('Unable to create user')
                })
            const userId = await prisma.user.findUnique({ where: { email: email } })
            if (userId) {
                const userAccount = await prisma.account
                    .create({
                        data: {
                            userId: userId.id,
                            type: 'oauth',
                            provider: 'credentials',
                            providerAccountId: '',
                        },
                    })
                    .catch(() => {
                        console.log('Unable store user account information')
                    })
            }
        }

        // Send off all validation checks to the page so that UI displays possible errors to user
        return NextResponse.json({ body: null, error: null })
    } catch (error) {
        return NextResponse.json({ body: null, error: 'error', message: 'Something went wrong!' })
    }
}
