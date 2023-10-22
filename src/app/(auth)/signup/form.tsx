'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import {FormEvent, useState} from 'react'
import { useRouter } from 'next/navigation'

export default function Form() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    })
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isPasswordVerified, setIsPasswordVerified] = useState(true)
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
        if(data.body.isEmailValid && data.body.isPasswordValid && data.body.isPasswordVerified) {
            router.push('/')
            router.refresh()
        } else {
            console.log(data)
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
                    <TextField margin='normal' error={!isEmailValid} type='email' fullWidth label='Email Address' name='email' />
                    <TextField margin='normal' error={!isPasswordValid} type='password' fullWidth label='Password' name='password' />
                    <TextField margin='normal' error={!isPasswordVerified} type='password' fullWidth label='Confirm Password' name='passwordCheck' />
                    <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href='#' variant='body2'>
                                    Already have an account?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='#' variant='body2'>
                                    Sign up with Google.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    )
}

