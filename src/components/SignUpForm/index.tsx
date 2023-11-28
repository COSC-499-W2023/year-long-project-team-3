'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import Link from '@mui/material/Link'
import { useFormik } from 'formik'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'
import { ObjectSchema } from 'yup'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility as VisibilityIconOn, VisibilityOff as VisibilityIconOff } from '@mui/icons-material'
import HorizontalSeparator from 'src/components/HorizontalSeparator'
import GoogleSigninButton from '@/components/GoogleSigninButton'

export type SignUpFormInputsData = {
    email: string
    password: string
    passwordConfirmation: string
}

export default function SignUpForm() {
    const router = useRouter()

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const handleClickShowPassword = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleClickShowConfirmPassword = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: SignUpFormInputsData) => handleSubmit(values),
    })

    return (
        <>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 'md',
                }}
            >
                <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                    Signup
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box
                        gap={1}
                        sx={{
                            p: 5,
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
                            type='email'
                            label='Email Address'
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            // this ensures the layout does not get shifted by the helper text
                            FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                            helperText={formik.touched.email && formik.errors.email}
                            data-cy='email'
                        />
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
                            data-cy='passwordVerification'
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
                            Sign Up
                        </Button>
                    </Box>
                </form>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 'md',
                    }}
                >
                    <Typography sx={{ mx: 6 }}>
                        Already have an account?{' '}
                        <Link data-cy='link-to-login' href='/login'>
                            Go to login
                        </Link>
                    </Typography>
                    <Box sx={{ my: 4, display: 'flex', alignItems: 'center', width: '100%' }}>
                        <HorizontalSeparator />
                        <Typography sx={{ mx: 2 }}>OR</Typography>
                        <HorizontalSeparator />
                    </Box>
                    <GoogleSigninButton />
                </Box>
            </Box>
        </>
    )

    async function handleSubmit(values: SignUpFormInputsData) {
        try {
            // Send form data to api
            const response = await fetch('api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            })

            const userInfo = await response.json()
            if (response.status == 201) {
                logger.info(`User ${ userInfo.user.email } successfully signed up`)
                router.push('/login')
                router.refresh()
            } else {
                toast.error(userInfo.error)
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const getCharacterValidationError = (missingCharacter: string): string => {
    return `Your password must have at least one ${ missingCharacter } character`
}

const validationSchema: ObjectSchema<SignUpFormInputsData> = yup.object().shape({
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
