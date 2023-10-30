import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { UserSignUpData } from '@/types/auth/user'

export function isEmailValid(email: string) {
    // Validate email address using regular expression
    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
    return emailRegex.test(email)
}

export function isPasswordValid(password: string) {
    // Validate password using regular expression
    // TODO: where is the regular expression?
    return password.length > 0
}

export async function isEmailUnique(email: string) {
    // Check if email already exists in database
    try {
        const existingEmail = await prisma.user.findUnique({
            where: { email: email },
        })
        return !existingEmail
    } catch (err) {
        logger.error(err)
    }
}

export async function isSignUpDataValid(signUpData: UserSignUpData) {
    const { email, password } = signUpData

    return isEmailValid(email) && isPasswordValid(password) && (await isEmailUnique(email))
}
