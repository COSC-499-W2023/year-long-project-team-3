'use client'

import LoginForm from '../../../components/LoginForm'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
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
            router.push('/dashboard')
        } else if (status === 'unauthenticated') {
            setIsLoginPageVisible(true)
        } else {
            setIsLoginPageVisible(false)
        }
    }, [router, status])

    return (
        isLoginPageVisible && (
            <>
                <UserAccountNav {...session} />
                <LoginForm />
            </>
        )
    )
}
