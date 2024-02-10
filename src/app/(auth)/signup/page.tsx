'use client'

import SignUpForm from '@/components/SignUpForm'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, type SessionContextValue } from 'next-auth/react'
import { Box } from '@mui/material'

export default function SignUpPage() {
    const session: SessionContextValue = useSession()
    const { status } = session
    const router = useRouter()
    const [isSignUpPageVisible, setIsSignUpPageVisible] = useState(false)
    const callbackUrl = useSearchParams()!.get('callbackUrl')

    useEffect(() => {
        if (status === 'authenticated') {
            setIsSignUpPageVisible(false)
            router.push(callbackUrl ? callbackUrl : '/dashboard')
        } else if (status === 'unauthenticated') {
            setIsSignUpPageVisible(true)
        } else {
            setIsSignUpPageVisible(false)
        }
    }, [callbackUrl, router, status])

    return (
        isSignUpPageVisible && (
            <>
                <Box sx={{ py: '2rem'}}>
                    <SignUpForm />
                </Box>
            </>
        )
    )
}
