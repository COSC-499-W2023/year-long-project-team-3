import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, passwordCheck } = body
        let isEmailValid = true
        let isPasswordValid = true
        let isPasswordVerified = true
        // TODO: check database for emails already in use
        // Check if email already exists
        /*
        const existingEmail = await prisma.user.findUnique({
            where: {email: email },
        })
        if(existingEmail) {
            return NextResponse.json({ user: null, message: 'Email already in use'},)
        }
        */
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
        // TODO: create user object in database
        /*
        const newUser = await prisma.user.create({
            data: {
                email,
                password,
            },
        })
        const { password: newUserPassword, ...rest } = newUser
        return NextResponse.json({ user: rest, message: 'User created successfully' })
        */
        const errorBody = { isEmailValid, isPasswordValid, isPasswordVerified }
        return NextResponse.json({ body: errorBody, error: null })
    } catch (error) {
        return NextResponse.json({ body: null, error: 'error', message: 'Something went wrong!' })
    }
}
