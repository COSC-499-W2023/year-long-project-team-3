'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import LandingPageAppBar from '@/components/LandingPage/LandingPageAppBar'
import Logo from '@/components/Logo/logo'

export default function LoginForm() {
    const router = useRouter()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const email = formData.get('email')
        const password = formData.get('password')

        const signInData = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        })

        console.log(signInData)
        if (signInData?.error) {
            toast.error('An error occurred during sign-up!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            })
        } else {
            router.refresh()
            router.push('/')
        }
    }

    return (
        <>
            <LandingPageAppBar></LandingPageAppBar>
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
                            margin='normal'
                            variant='outlined'
                            type='email'
                            label='Email Address'
                            name='email'
                            data-cy='email'
                        />
                        <TextField
                            margin='normal'
                            variant='outlined'
                            type='password'
                            label='Password'
                            name='password'
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
                            <Link href='/../signup' variant='body2' data-cy='login'>
                                Don&apos;t have an account?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='/../signin' variant='body2'>
                                Sign in with Google.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )
}
