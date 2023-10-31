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
    const [isSignUpFormVisible, setIsSignUpFormVisible] = useState(false)

    useEffect(() => {
        if (status === 'authenticated') {
            setIsSignUpFormVisible(false)
            router.push('/dashboard')
        } else if (status === 'unauthenticated') {
            setIsSignUpFormVisible(true)
        } else {
            setIsSignUpFormVisible(false)
        }
    }, [router, status])

    return (
        isSignUpFormVisible && (
            <>
                <Header {...session} />
                <SignUpForm />
            </>
        )
    )
}
