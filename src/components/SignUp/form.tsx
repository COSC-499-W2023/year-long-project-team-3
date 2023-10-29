'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import LandingPageAppBar from '@/components/LandingPage/LandingPageAppBar'
import Logo from '@/components/Logo/logo'

export default function Form() {
    const router = useRouter()
    // Function for when user wants to submit form data
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Get data from form
        const formData = new FormData(e.currentTarget)

        // I have no idea how to check passwords match in any other way
        const password = formData.get('password')
        const passwordCheck = formData.get('passwordCheck')

        if (password == passwordCheck) {
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
            router.push('/')
            router.refresh()
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
                            style={{width: 400}}
                            margin='normal'
                            variant='outlined'
                            type='email'
                            label='Email Address'
                            name='email'
                            required
                            data-cy='email'
                        />
                        <TextField
                            style={{width: 400}}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            type='password'
                            label='Password'
                            name='password'
                            required
                            data-cy='password'
                        />
                        <TextField
                            style={{width: 400}}
                            margin='normal'
                            fullWidth
                            variant='outlined'
                            type='password'
                            label='Confirm Password'
                            name='passwordCheck'
                            required
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
                </form>
            </Box>
        </>
    )
}
