'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React from 'react'

// TODO: Implement this page (right now it's only a bare bones version for testing)
export default function SubmissionBoxReviewAndCreatePage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
        </>
    )
}
