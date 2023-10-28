import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        // Collect information from page
        const body = await req.json()
        // Deconstruct request
        const { email, password, passwordCheck } = body
        // Validation variables
        let isEmailValid = true
        let isPasswordValid = true
        let isPasswordVerified = true
        let isEmailAvailable = true

        // Validate email address using regular expression
        let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
        if (!emailRegex.test(email)) {
            isEmailValid = false
        }

        // Validate password using regular expression
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            isPasswordValid = false
        }

        // Validate password and confirmation password are equivalent
        if (password != passwordCheck) {
            isPasswordVerified = false
        }

        // Check if email already exists in database
        const existingEmail = await prisma.user
            .findUnique({
                where: { email: email },
            })
            .catch(() => {
                console.log('Unable to connect to database')
            })
        if (existingEmail) {
            isEmailAvailable = false
        }

        // If all input fields valid, create the user and store in the database
        if (isEmailValid && isPasswordValid && isPasswordVerified && isEmailAvailable) {
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
        }

        // Send off all validation checks to the page so that UI displays possible errors to user
        const errorBody = { isEmailValid, isPasswordValid, isPasswordVerified, isEmailAvailable }
        return NextResponse.json({ body: errorBody, error: null })
    } catch (error) {
        return NextResponse.json({ body: null, error: 'error', message: 'Something went wrong!' })
    }
}
