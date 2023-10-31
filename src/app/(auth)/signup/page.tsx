'use client'

import Header from '@/components/Header'
import SignUpForm from '@/components/SignUpForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, type SessionContextValue } from 'next-auth/react'

export default function SignUpPage() {
    const session: SessionContextValue = useSession()
    const { status } = session
    const router = useRouter()
    const [isSignUpPageVisible, setIsSignUpPageVisible] = useState(false)

    useEffect(() => {
        if (status === 'authenticated') {
            setIsSignUpPageVisible(false)
            router.push('/dashboard')
        } else if (status === 'unauthenticated') {
            setIsSignUpPageVisible(true)
        } else {
            setIsSignUpPageVisible(false)
        }
    }, [router, status])

    return (
        isSignUpPageVisible && (
            <>
                <Header {...session} />
                <SignUpForm />
            </>
        )
    )
}
