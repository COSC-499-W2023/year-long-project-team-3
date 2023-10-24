import prisma from '@/lib/prisma'

require('dotenv').config()

export default async function clearDB() {
    console.log(process.env.DATABASE_URL)

    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})

    return null
}
