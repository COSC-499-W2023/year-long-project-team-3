import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

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

        return NextResponse.json({ body, message: 'User created successfully' })
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong!' })
    }
}