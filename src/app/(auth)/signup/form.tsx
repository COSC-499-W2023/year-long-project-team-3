'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Form() {
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isPasswordVerified, setIsPasswordVerified] = useState(true)
    const [isEmailAvailable, setIsEmailAvailable] = useState(true)
    const router = useRouter()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const response = await fetch('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                passwordCheck: formData.get('passwordCheck'),
            }),
        })
        const data = await response.json()
        setIsEmailValid(data.body.isEmailValid)
        setIsPasswordValid(data.body.isPasswordValid)
        setIsPasswordVerified(data.body.isPasswordVerified)
        setIsEmailAvailable(data.body.isEmailAvailable)
        if (
            data.body.isEmailValid &&
            data.body.isPasswordValid &&
            data.body.isPasswordVerified &&
            data.body.isEmailAvailable
        ) {
            router.push('/')
            router.refresh()
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
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin='normal'
                        size='medium'
                        variant='outlined'
                        error={!isEmailValid || !isEmailAvailable}
                        type='email'
                        fullWidth
                        label='Email Address'
                        name='email'
                        helperText={(!isEmailValid && 'Invalid Email') || (!isEmailAvailable && 'Email already in use')}
                        data-cy='email'
                    />
                    <TextField
                        margin='normal'
                        size='medium'
                        variant='outlined'
                        error={!isPasswordValid}
                        type='password'
                        fullWidth
                        label='Password'
                        name='password'
                        helperText={
                            !isPasswordValid &&
                            'Password must be at least 8 characters long and have: one upper and one lowercase letter, a numeral, a symbol'
                        }
                        data-cy='password'
                    />
                    <TextField
                        margin='normal'
                        size='medium'
                        variant='outlined'
                        error={!isPasswordVerified}
                        type='password'
                        fullWidth
                        label='Confirm Password'
                        name='passwordCheck'
                        helperText={!isPasswordVerified && 'Does not match password'}
                        data-cy='passwordVerification'
                    />
                    <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} data-cy='submit'>
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href='/../login' variant='body2' data-cy='login'>
                                Already have an account?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='/../signin' variant='body2'>
                                Sign up with Google.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    )
}