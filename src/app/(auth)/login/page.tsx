'use client'

import LoginForm from '../../../components/LoginForm'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type SessionContextValue, useSession } from 'next-auth/react'
import { Box } from '@mui/material'

export default function LoginPage() {
    const session: SessionContextValue = useSession()
    const router = useRouter()
    const [isLoginPageVisible, setIsLoginPageVisible] = useState(false)

    const { status } = session
    const callbackUrl = useSearchParams()!.get('callbackUrl')

    useEffect(() => {
        if (status === 'authenticated') {
            setIsLoginPageVisible(false)
            if (callbackUrl) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
                if (callbackUrl.startsWith(baseUrl)) {
                    router.push(callbackUrl.substring(baseUrl.length))
                } else {
                    router.push(callbackUrl)
                }
            } else {
                router.push('/dashboard')
            }
        } else if (status === 'unauthenticated') {
            setIsLoginPageVisible(true)
        } else {
            setIsLoginPageVisible(false)
        }
    }, [callbackUrl, router, status])

    return (
        isLoginPageVisible && (
            <>
                <Box sx={{ py: '2rem'}}>
                    <LoginForm />
                </Box>
            </>
        )
    )
}
