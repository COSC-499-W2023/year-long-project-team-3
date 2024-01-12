'use client'

import Header from '@/components/Header'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function VerifyEmail() {
    const session = useSession()
    const router = useRouter()
    const emailVerificationId = usePathname()?.split('/').pop()
    const [pageVisible, setPageVisible] = useState(false)
    const [pageMsg, setPageMsg] = useState()

    useEffect(() => {
        fetch(`/api/verify-email/${ emailVerificationId }`).then(async (res) => {
            console.log(res)
            if (res.status === 200) {
                setPageVisible(true)
            } else if (res.status === 400) {
                router.push('/not-found')
            } else {
                setPageVisible(true)
            }
            setPageMsg(await res.json())
        })
    }, [emailVerificationId, router])

    return (
        <>
            <Header {...session} />
            {pageVisible && (
                <Box
                    sx={{
                        p: '2rem',
                    }}
                >
                    Slug: {pageMsg}
                </Box>
            )}
        </>
    )
}
