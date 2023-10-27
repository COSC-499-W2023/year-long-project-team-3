import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, passwordCheck } = body
        let isEmailValid = true
        let isPasswordValid = true
        let isPasswordVerified = true
        let isEmailAvailable = true
        // validate email address is valid
        let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
        if (!emailRegex.test(email)) {
            isEmailValid = false
        }
        // validate password is valid
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            isPasswordValid = false
        }
        // validate password and confirmation password are equivalent
        if (password != passwordCheck) {
            isPasswordVerified = false
        }

        // Check if email already exists
        const existingEmail = await prisma.user
            .findUnique({
                where: { email: email },
            })
            .catch(() => {
                console.log('still throwing')
            })
        if (existingEmail) {
            isEmailAvailable = false
        }

        const hashedPassword = await hash(password, 10)
        if (isEmailValid && isPasswordValid && isPasswordVerified && isEmailAvailable) {
            // create user object in database
            const newUser = await prisma.user
                .create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                })
                .catch(() => {
                    console.log('data base throwing')
                })
        }
        const errorBody = { isEmailValid, isPasswordValid, isPasswordVerified, isEmailAvailable }
        console.log(errorBody)
        return NextResponse.json({ body: errorBody, error: null })
    } catch (error) {
        console.log('error happening')
        return NextResponse.json({ body: null, error: 'error', message: 'Something went wrong!' })
    }
}
