'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo/logo'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import logger from '@/utils/logger'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'
import { UserSignUpData } from '@/types/auth/user'
import { toast } from 'react-toastify'

const getCharacterValidationError = (str: string): string => {
    return `Your password must have at least one ${ str } character`
}

const validationSchema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required('Email is required'),
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

export default function SignUpForm() {
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values).then()
        },
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
                <Typography variant='h4' sx={{ fontWeight: 'medium' }}>
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
                            <Link href='/login' variant='body2' data-cy='login'>
                                Already have an account?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Button
                                data-cy='google-sign-in-btn'
                                sx={{ textTransform: 'capitalize' }}
                                onClick={(e) => signInWithGoogle(e)}
                            >
                                Sign in with Google
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )

    async function handleSubmit(values: UserSignUpData) {
        // Send form data to api
        const response = await fetch('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        })

        const errorMessage = await response.json()

        if (response.status != 201) {
            toast.error(errorMessage.error)
        } else {
            router.push('/login')
            router.refresh()
        }
    }
}

function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>): void {
    try {
        e.preventDefault()
        // FIXME: callback URL is being ignored
        signIn('google', { callbackUrl: `${ process.env.NEXT_PUBLIC_BASE_URL }/dashboard` }).catch((error) => {
            logger.error('An unexpected error occurred while log in with Google: ' + error)
        })
    } catch (error) {
        logger.error('An unexpected error occurred while log in with Google: ' + error)
    }
}
