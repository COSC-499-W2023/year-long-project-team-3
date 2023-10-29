import prisma from '@/lib/prisma'

export function emailVerification(email: string) {
    // Validate email address using regular expression
    let emailRegex = /[a-z0-9]+@[a-z]{2,3}/
    return (!emailRegex.test(email))
}

export function passwordVerification(password: string) {
// Validate password using regular expression
    return (password.length > 0)
}

export function passwordMatchVerification(password: string, passwordCheck: string) {
    // Validate password and confirmation password are equivalent
    return (password != passwordCheck)
}

export async function emailExistsInDatabase(email: string) {
    // Check if email already exists in database
    const existingEmail = await prisma.user
        .findUnique({
            where: { email: email },
        })
        .catch(() => {
            console.log('Unable to connect to database')
        })
    return !existingEmail
}