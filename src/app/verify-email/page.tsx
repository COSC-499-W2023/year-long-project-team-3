'use client'

import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function VerifyEmail() {
    const router = useRouter()

    const [buttonText, setButtonText] = useState('Resend Email')

    useEffect(() => {
        // Only automatically send email if the user doesn't have an active verification token
        fetch('/api/verify-email/has-open-token').then(async (res) => {
            if (res.status === 200) {
                const { hasOpenToken, isUserVerified } = await res.json()
                if (isUserVerified) {
                    router.push('/dashboard')
                    toast.info('Your email is already verified!')
                }
                if (!hasOpenToken) {
                    sendEmail((_) => {})
                }
                setButtonText('Resend Email')
            }
        }).catch(() => {
            setButtonText('Failed to send. Try again')
        })
    }, [router])

    const resendEmail = () => {
        setButtonText('Sending...')
        sendEmail(setButtonText)
    }

    return (
        <>
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
                <Logo fontSize={72}/>
                <Typography sx={{
                    fontSize: '32px',
                    fontWeight: '600',
                    textAlign: 'center',
                }}>It looks like your email isn&apos;t verified! Click the link we sent to your email to verify your account</Typography>
                <Button onClick={resendEmail} variant='contained' sx={{ fontSize: '20px' }} data-cy='verify-email-button'>{buttonText}</Button>
            </Box>
        </>
    )
}

function sendEmail(setButtonText: (text: string) => void) {
    fetch('/api/verify-email/send-email').then((res) => {
        if (res.status === 200) {
            setButtonText('Email Sent!')
        } else {
            setButtonText('Failed to send. Try again')
        }
    }).catch(() => {
        setButtonText('Failed to send. Try again')
    })
}
