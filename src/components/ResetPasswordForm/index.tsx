'use client'
import { Box, Button, IconButton, InputAdornment } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { ResetPasswordData } from '@/types/auth/user'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'
import { Visibility as VisibilityIconOn, VisibilityOff as VisibilityIconOff } from '@mui/icons-material'
import { toast } from 'react-toastify'
import logger from '@/utils/logger'
import { useRouter } from 'next/navigation'

export default function ResetPasswordEmailAddressForm(props: {resetPasswordId: string}) {
    const router = useRouter()
    const formik = useFormik<ResetPasswordData>({
        initialValues: {
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: ResetPasswordData) => handleSubmit(values),
    })

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const handleClickShowPassword = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleClickShowConfirmPassword = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    return (
        <Box
            gap={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'md',
            }}
        >
            <Typography variant='h4' sx={{ fontWeight: 'medium', my: '1rem'}}>
                Reset Password
            </Typography>
            <Typography sx={{maxWidth: 'sm', textAlign: 'center'}}>
                Please enter a new password for your account.
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Box
                    gap={1}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 'md',
                        '& .MuiTextField-root': { my: 1.5, mx: 7, width: '100%' },
                    }}
                >
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type={passwordVisible ? 'text' : 'password'}
                        label='Password'
                        name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.password && formik.errors.password}
                        data-cy='password'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={handleClickShowPassword}
                                        data-cy='toggle-password-visibility'
                                    >
                                        {passwordVisible ? <VisibilityIconOn /> : <VisibilityIconOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        label='Confirm Password'
                        name='passwordConfirmation'
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                        data-cy='passwordConfirmation'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle confirm password visibility'
                                        onClick={handleClickShowConfirmPassword}
                                        data-cy='toggle-confirm-password-visibility'
                                    >
                                        {confirmPasswordVisible ? <VisibilityIconOn /> : <VisibilityIconOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        data-cy='submit'
                    >
                        Reset Password
                    </Button>
                </Box>
            </form>
        </Box>
    )

    async function handleSubmit(data: ResetPasswordData) {
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token: props.resetPasswordId,
                    password: data.password,
                    passwordConfirmation: data.passwordConfirmation,
                }),
            })

            if (response.status == 201) {
                toast.success('Password has been reset.')
                logger.info('Reset password')
            } else {
                toast.error('There was an error in the password reset process. Please contact support.')
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        } finally {
            router.push('/login')
            router.refresh()
        }
    }
}

const getCharacterValidationError = (missingCharacter: string): string => {
    return `Your password must have at least one ${ missingCharacter } character`
}

const validationSchema: ObjectSchema<ResetPasswordData> = yup.object().shape({
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
