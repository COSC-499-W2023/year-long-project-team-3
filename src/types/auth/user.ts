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

export type ResetPasswordAPIData = {
    token: string,
    password: string,
    passwordConfirmation: string,
}
