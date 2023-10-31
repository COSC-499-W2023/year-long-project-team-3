import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
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

export function getEmailRegex(): RegExp {
    // Regexp follow the RFC 5322 Official Standard: https://emailregex.com/
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
}

export function isValidEmail(email: string): boolean {
    return getEmailRegex().test(email)
}

export function isValidPassword(password: string): boolean {
    const passwordRegex: RegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[^ ]+$/
    return (
        passwordRegex.test(password) && password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH
    )
}