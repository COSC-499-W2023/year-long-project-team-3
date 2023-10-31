'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'

export default function DashboardPage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
            <Dashboard userEmail={session.data?.user?.email!} />
        </>
    )
}
