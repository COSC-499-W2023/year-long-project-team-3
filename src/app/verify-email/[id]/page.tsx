'use client'

import Header from '@/components/Header'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PageLoadProgress from '@/components/PageLoadProgress'

export default function VerifyEmail() {
    const session = useSession()
    const router = useRouter()
    const emailVerificationId = usePathname()?.split('/').pop()
    const [pageMsg, setPageMsg] = useState('')
    const [pageStatus, setPageStatus] = useState(0)
    const [buttonText, setButtonText] = useState('Resend Email')

    // Hook is being called twice for some reason, so this stops that
    let callCount = 0
    useEffect(() => {
        if (callCount === 0) {
            callCount++
            fetch(`/api/verify-email/${ emailVerificationId }`).then(async (res) => {
                if (res.status === 200) {
                    setPageMsg('Email verified!')
                    setPageStatus(1)
                } else if (res.status === 400) {
                    const error = await res.json()
                    setPageMsg(error.error ?? 'Invalid verification link.')
                    setPageStatus(2)
                } else {
                    setPageMsg('There was an issue while verifying your email.')
                    setPageStatus(2)
                }
            })
        }
    }, [callCount, emailVerificationId])

    const resendEmail = () => {
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
            {/* Main Body */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: '4rem',
                    gap: '2rem',
                }}
            >
                {pageStatus === 0 ? (
                    <PageLoadProgress />
                ) : (
                    <>
                        <Typography
                            sx={{
                                fontSize: '36px',
                                fontWeight: '600',
                            }}
                        >
                            {pageMsg}
                        </Typography>
                        <Button variant='contained' data-cy='dashboard-button' onClick={() => router.push('/dashboard')}>
                    Proceed to Dashboard
                        </Button>
                        {pageStatus === 2 && (
                            <Button onClick={resendEmail} variant='contained'>{buttonText}</Button>
                        )}
                    </>
                )}
            </Box>
        </>
    )
}
