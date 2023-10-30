'use client'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import LandingPageAppBar from '@/components/LandingPage/LandingPageAppBar'
import Logo from '@/components/Logo/logo'
import { isEmailValid, isPasswordValid } from '@/utils/auth'

export default function SignUpForm() {
    const router = useRouter()

    // Values for form and form validation
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordCheckError, setPasswordCheckError] = useState(false)
    return (
        <>
            <LandingPageAppBar />
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
        if (emailError && passwordError && passwordCheckError) {
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
}
