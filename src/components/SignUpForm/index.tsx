'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import { useFormik } from 'formik'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'
import { ObjectSchema } from 'yup'

export type SignUpFormInputsData = {
    email: string
    password: string
    passwordConfirmation: string
}

export default function SignUpForm() {
    const router = useRouter()

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
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 'md',
                }}
            >
                <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                    Sign Up
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        gap={1}
                        sx={{
                            p: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 'xl',
                        }}
                    >
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            variant='outlined'
                            type='email'
                            label='Email Address'
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            data-cy='email'
                        />
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            type='password'
                            label='Password'
                            name='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            data-cy='password'
                        />
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            type='password'
                            label='Confirm Password'
                            name='passwordConfirmation'
                            value={formik.values.passwordConfirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                            data-cy='passwordVerification'
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                            data-cy='submit'
                        >
                            Sign Up
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Link data-cy='link-to-login' href='/login' variant='body2'>
                                Already have an account?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Button
                                data-cy='google-sign-in-btn'
                                sx={{ textTransform: 'capitalize' }}
                                onClick={signInWithGoogle}
                            >
                                Sign in with Google
                            </Button>
                        </Grid>
                    </Grid>
                </form>
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

    function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        signIn('google', { callbackUrl: `${ process.env.appBaseUrl }/dashboard` }).catch((err) => {
            logger.error('An unexpected error occurred while log in with Google: ' + err.error)
        })
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