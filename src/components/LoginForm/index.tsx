'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import Logo from '@/components/Logo'
import logger from '@/utils/logger'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { UserSignUpData } from '@/types/auth/user'
import { getEmailRegex } from '@/utils/verification'
import { ObjectSchema } from 'yup'
import { Divider, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import GoogleSigninButton from '@/components/GoogleSigninButton'

interface FormValues {
    email: string
    password: string
}

export default function LoginForm() {
    const [values, setValues] = useState<{ showPassword: boolean }>({ showPassword: false })

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
        password: yup.string().required('Enter your password'),
    })

    const router = useRouter()

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => handleSubmit(values),
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
                    Login
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box
                        gap={1}
                        sx={{
                            p: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 'xl',
                            '& .MuiTextField-root': { m: 1, width: '40ch' },
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
                            helperText={formik.touched.email && formik.errors.email}
                            data-cy='email'
                        />
                        <TextField
                            margin='normal'
                            variant='outlined'
                            type={values.showPassword ? 'text' : 'password'}
                            label='Password'
                            name='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            data-cy='password'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                </form>
                <Typography>
                    Don&apos;t have an account yet?{' '}
                    <Link data-cy='link-to-signup' href='/signup'>
                        Sign up now
                    </Link>
                </Typography>
                <Divider>OR</Divider>
                <GoogleSigninButton />
            </Box>
        </>
    )

    async function handleSubmit(userData: UserSignUpData) {
        try {
            const signInData = await signIn('credentials', {
                email: userData.email,
                password: userData.password,
                redirect: false,
            })

            if (!signInData) {
                toast.error('Error during login!')
            } else if (signInData.error) {
                toast.error(signInData.error)
            } else {
                logger.info(`User ${ userData.email } successfully signed up`)
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}
