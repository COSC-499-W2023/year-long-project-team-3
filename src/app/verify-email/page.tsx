'use client'

import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import Header from '@/components/Header'
import { useSession } from 'next-auth/react'

export default function VerifyEmail() {
    const session = useSession()
    const [buttonText, setButtonText] = useState('Send Verification Email')

    const resendEmail = () => {
        setButtonText('Sending...')
        fetch('/api/verify-email/send-email').then((res) => {
            if (res.status == 200) {
                setButtonText('Email Sent!')
            } else {
                setButtonText('Failed to send. Try again')
            }
        }).catch(() => {
            setButtonText('Failed to send. Try again')
        })
    }

    return (
        <>
            <Header {...session} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    p: '2rem',
                    gap: '2rem',
                }}
            >
                <Typography sx={{
                    fontSize: '36px',
                    fontWeight: '600',
                }}>It looks like your email isn&apos;t verified!</Typography>
                <Button onClick={resendEmail} variant='contained' sx={{ fontSize: '20px' }}>{buttonText}</Button>
            </Box>
        </>
    )
}
