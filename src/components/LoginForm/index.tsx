'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import Logo from '@/components/Logo'
import logger from '@/utils/logger'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { UserSignUpData } from '@/types/auth/user'
import { getEmailRegex } from '@/utils/verification'
import { ObjectSchema } from 'yup'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility as VisibilityIconOn, VisibilityOff as VisibilityIconOff } from '@mui/icons-material'
import GoogleSigninButton from '@/components/GoogleSigninButton'
import HorizontalSeparator from 'src/components/HorizontalSeparator'
import { useSearchParams } from 'next/navigation'

export default function LoginForm() {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const callbackUrl = useSearchParams()!.get('callbackUrl')

    const handleClickShowPassword = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const formik = useFormik<UserSignUpData>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: UserSignUpData) => handleSubmit(values),
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
                                            onMouseDown={handleMouseDownPassword}
                                            data-cy='toggle-password-visibility'
                                        >
                                            {passwordVisible ? <VisibilityIconOn /> : <VisibilityIconOff />}
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
                            Log In
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
                        Don&apos;t have an account yet?{' '}
                        <Link data-cy='link-to-signup' href={'/signup' + (callbackUrl ? `?callbackUrl=${ encodeURIComponent(callbackUrl) }` : '')}>
                            Sign up now
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

    async function handleSubmit(userData: UserSignUpData) {
        try {
            const signInData = await signIn('credentials', {
                email: userData.email.toLowerCase(),
                password: userData.password,
                redirect: false,
            })

            if (!signInData) {
                toast.error('Error during login!')
            } else if (signInData.error) {
                toast.error(signInData.error)
            } else {
                toast.success(`User ${ userData.email.toLowerCase() } successfully logged in`)
                logger.info(`User ${ userData.email.toLowerCase() } successfully logged in`)
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const validationSchema: ObjectSchema<UserSignUpData> = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
    password: yup.string().required('Enter your password'),
})
