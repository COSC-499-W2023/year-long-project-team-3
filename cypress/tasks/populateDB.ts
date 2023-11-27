import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { MOCKUSER } from '../utils/constants'

export default async function populateDB() {
    const hashedPassword = await hash(MOCKUSER.password, 10)
    await prisma.user.create({
        data: {
            email: MOCKUSER.email,
            password: hashedPassword,
            accounts: {
                create: {
                    type: 'bcrypt',
                    provider: 'credentials',
                    providerAccountId: MOCKUSER.email,
                },
            },
        },
    })
    return null
}
