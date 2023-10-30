'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo/logo'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import logger from '@/utils/logger'
import { isEmailUnique, isEmailValid, isPasswordValid } from '@/utils/verification'

export default function SignUpForm() {
    const router = useRouter()

    // Values for form and form validation
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [duplicateEmailError, setDuplicateEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordCheckError, setPasswordCheckError] = useState(false)
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
                <form onSubmit={handleSubmit}>
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
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            error={emailError || duplicateEmailError}
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
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            type='password'
                            label='Confirm Password'
                            name='passwordCheck'
                            required
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            value={passwordCheck}
                            error={passwordCheckError}
                            data-cy='passwordVerification'
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ fontSize: 15, borderRadius: 28 }}
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
                            <Button onClick={(e) => signInWithGoogle(e)}>Sign in with Google</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        // Validate and set errors on field if not valid
        setEmailError(!isEmailValid(email))
        setPasswordError(!isPasswordValid(password))
        setPasswordCheckError(password == passwordCheck)
        setDuplicateEmailError(!isEmailUnique(email))
        if (emailError && passwordError && passwordCheckError && duplicateEmailError) {
            // Send form data to api
            const response = await fetch('api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    passwordCheck: formData.get('passwordCheck'),
                }),
            })

            // Change this to the login page once developed
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
