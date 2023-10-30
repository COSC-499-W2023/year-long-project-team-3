import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function isEmailUnique(email: string): Promise<boolean> {
    try {
        const existingEmail = await prisma.user.findFirst({
            where: { email: email },
        })
        return existingEmail == null
    } catch (err) {
        logger.error(err)
        return false
    }
}
