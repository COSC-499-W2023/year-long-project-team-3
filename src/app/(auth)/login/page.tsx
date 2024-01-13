'use client'

import LoginForm from '../../../components/LoginForm'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type SessionContextValue, useSession } from 'next-auth/react'

export default function LoginPage() {
    const session: SessionContextValue = useSession()
    const router = useRouter()
    const [isLoginPageVisible, setIsLoginPageVisible] = useState(false)

    const { status } = session
    useEffect(() => {
        if (status === 'authenticated') {
            setIsLoginPageVisible(false)

            // Check if user email verified
            fetch('/api/verify-email/is-verified').then(async (res) => {
                if (res.status === 200) {
                    const isVerified = (await res.json()).isVerified
                    if (isVerified) {
                        router.push('/dashboard')
                    } else {
                        router.push('/verify-email')
                    }
                }
            })
        } else if (status === 'unauthenticated') {
            setIsLoginPageVisible(true)
        } else {
            setIsLoginPageVisible(false)
        }
    }, [router, status])

    return (
        isLoginPageVisible && (
            <>
                <Header {...session} />
                <LoginForm />
            </>
        )
    )
}
