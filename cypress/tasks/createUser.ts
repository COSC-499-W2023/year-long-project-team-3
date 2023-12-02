import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

export default async function createUser(user: { email: string; password: string }) {
    const hashedPassword = await hash(user.password, 10)
    return await prisma.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
        },
    })
}
