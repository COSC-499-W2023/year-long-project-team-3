import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { User } from '@prisma/client'

export type CreateUserTaskProps = {
    email: string
    password: string
    verifyEmail: boolean | undefined
}

export default async function createUser(userToCreate: CreateUserTaskProps): Promise<User> {
    const hashedPassword = await hash(userToCreate.password, 10)
    return prisma.user.create({
        data: {
            email: userToCreate.email,
            password: hashedPassword,
            emailVerified: (userToCreate.verifyEmail ?? true) ? new Date() : null,
        },
    })
}
