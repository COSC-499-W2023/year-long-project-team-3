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

export default function SignUpForm() {
    // Page vars to keep track of if user input is valid or not
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isPasswordVerified, setIsPasswordVerified] = useState(true)
    const [isEmailAvailable, setIsEmailAvailable] = useState(true)
    const router = useRouter()

    // Function for when user wants to submit form data
    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Get data from form
        const formData = new FormData(e.currentTarget)
        // Send form data to api
        const response = await fetch('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                passwordCheck: formData.get('passwordCheck'),
            }),
        })

        // Get result from api. Result will be if the users input is valid or not
        const data = await response.json()
        setIsEmailValid(data.body.isEmailValid)
        setIsPasswordValid(data.body.isPasswordValid)
        setIsPasswordVerified(data.body.isPasswordVerified)
        setIsEmailAvailable(data.body.isEmailAvailable)

        // If all the fields are valid then send user to next page
        if (
            data.body.isEmailValid &&
            data.body.isPasswordValid &&
            data.body.isPasswordVerified &&
            data.body.isEmailAvailable
        ) {
            router.push('/login')
            router.refresh()
        }
        // TODO: add toast?
    }

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
                <form onSubmit={handleSignUp}>
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
                            error={!isEmailValid || !isEmailAvailable}
                            type='email'
                            label='Email Address'
                            name='email'
                            helperText={
                                (!isEmailValid && 'Invalid Email') || (!isEmailAvailable && 'Email already in use')
                            }
                            data-cy='email'
                        />
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            error={!isPasswordValid}
                            type='password'
                            label='Password'
                            name='password'
                            helperText={
                                !isPasswordValid &&
                                'Password must be at least 8 characters long and have: ' +
                                    'one upper and one lowercase letter, a numeral, a symbol'
                            }
                            data-cy='password'
                        />
                        <TextField
                            style={{ width: 400 }}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            error={!isPasswordVerified}
                            type='password'
                            label='Confirm Password'
                            name='passwordCheck'
                            helperText={!isPasswordVerified && 'Does not match password'}
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
                            <Button onClick={(e) => signInWithGoogle(e)}>Sign in with Google.</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )
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