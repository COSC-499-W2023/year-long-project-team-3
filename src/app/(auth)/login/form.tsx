'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function Form() {
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
            // TODO: Add toast message here
            console.log('Error!')
        } else {
            router.refresh()
            router.push('/')
        }
    }

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component='h1' variant='h5'>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin='normal'
                        size='medium'
                        variant='outlined'
                        type='email'
                        fullWidth
                        label='Email Address'
                        name='email'
                        data-cy='email'
                    />
                    <TextField
                        margin='normal'
                        size='medium'
                        variant='outlined'
                        type='password'
                        fullWidth
                        label='Password'
                        name='password'
                        data-cy='password'
                    />
                    <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} data-cy='submit'>
                        Login
                    </Button>
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
        </Container>
    )
}
