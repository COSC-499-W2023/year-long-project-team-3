import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'

export function isEmailValid(email: string) {
    // Validate email address using regular expression
    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
    return emailRegex.test(email)
}

export function isPasswordValid(password: string) {
    // Validate password using regular expression
    const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[a-zA-Z\d@$!%*?&])$/)
    return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH && regExp.test(password)
}
