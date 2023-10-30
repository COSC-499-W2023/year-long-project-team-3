'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import Logo from '@/components/Logo/logo'
import logger from '@/utils/logger'
import { isEmailValid, isPasswordValid } from '@/utils/auth'

export default function LoginForm() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

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
                }}
            >
                <Typography variant='h4' sx={{ fontWeight: 'medium' }}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box
                        gap={1}
                        sx={{
                            p: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            variant='outlined'
                            type='email'
                            label='Email Address'
                            name='email'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            error={emailError}
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
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            error={passwordError}
                            data-cy='password'
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ fontSize: 15, borderRadius: 28 }}
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
                            <Button data-cy='google-sign-in-btn' onClick={(e) => signInWithGoogle(e)}>
                                Sign in with Google
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        new FormData(e.currentTarget)

        // Validate and set errors on field if not valid
        setEmailError(!isEmailValid(email))
        setPasswordError(!isPasswordValid(password))
        console.log(emailError)
        console.log(passwordError)
        console.log(email)
        console.log(password)
        if (!emailError && !passwordError) {
            const signInData = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            })

            console.log(signInData)
            if (signInData?.error) {
                toast.error(signInData.error)
            } else {
                router.refresh()
                router.push('/dashboard')
            }
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
