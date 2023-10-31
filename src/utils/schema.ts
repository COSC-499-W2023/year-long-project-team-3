import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'

const getCharacterValidationError = (str: string): string => {
    return `Your password must have at least one ${ str } character`
}

export const validationSchema = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
    password: yup
        .string()
        .min(MIN_PASSWORD_LENGTH, `Password should be a minimum of ${ MIN_PASSWORD_LENGTH } characters long`)
        .max(MAX_PASSWORD_LENGTH, `Password should be a maximum of ${ MAX_PASSWORD_LENGTH } characters long`)
        .required('Enter your password')
        .matches(/[0-9]/, getCharacterValidationError('numeric'))
        .matches(/[a-z]/, getCharacterValidationError('lowercase'))
        .matches(/[A-Z]/, getCharacterValidationError('uppercase')),
    passwordConfirmation: yup
        .string()
        .required('Please re-type your password')
        .oneOf([yup.ref('password')], 'Your passwords must match'),
})
