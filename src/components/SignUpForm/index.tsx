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
import { validationSchema } from '@/utils/schema'

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

    function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault()
        signIn('google', { callbackUrl: '/dashboard' }).catch((err) => {
            logger.error('An unexpected error occurred while log in with Google: ' + err.error)
        })
    }
}
