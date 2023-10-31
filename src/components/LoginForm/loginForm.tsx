'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import Logo from '@/components/Logo/logo'
import logger from '@/utils/logger'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { UserSignUpData } from '@/types/auth/user'
import { getEmailRegex } from '@/utils/verification'

const validationSchema = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
    password: yup.string().required('Enter your password'),
})

export default function LoginForm() {
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
                    Login
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
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                            data-cy='submit'
                        >
                            Log In
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Link href='/signup' variant='body2' data-cy='login'>
                                Don&apos;t have an account?
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
        const signInData = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        // Change this to the login page once developed
        if (!signInData) {
            toast.error('Error during login!')
        } else if (signInData.error) {
            toast.error(signInData.error)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>): void {
        try {
            e.preventDefault()
            signIn('google', {
                callbackUrl: `${ process.env.NEXT_PUBLIC_BASE_URL }/dashboard`,
                redirect: true,
            }).catch((error) => {
                logger.error('An unexpected error occurred while log in with Google: ' + error)
            })
        } catch (error) {
            logger.error('An unexpected error occurred while log in with Google: ' + error)
        }
    }

}

