export type UserSignUpData = {
    email: string
    password: string
}

export type ResetPasswordEmailData = {
    email: string
}

export type ResetPasswordData = {
    password: string,
    passwordConfirmation: string
}
