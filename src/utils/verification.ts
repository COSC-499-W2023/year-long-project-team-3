import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { bool } from 'yup'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'

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

export function isValidPassword(password: string): boolean {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[^ ]+$/
    return (
        passwordRegex.test(password) && password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH
    )
}
