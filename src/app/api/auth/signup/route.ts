import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, passwordCheck } = body
        console.log({ email, password })
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
            return NextResponse.json({ user: null, message: 'Email not valid' })
        }
        // validate password is valid
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            return NextResponse.json({ user: null, message: 'Password not valid' })
        }
        // validate password and confirmation password are equivalent
        if (password != passwordCheck) {
            return NextResponse.json({ user: null, message: 'Passwords do not match' })
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
        console.log({ email, password })
        return NextResponse.json({ body, message: 'User created successfully' })
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong!' })
    }
}
