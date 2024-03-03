'use client'

import { Box, Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import logger from '@/utils/logger'
import { useRouter } from 'next/navigation'

export default function HeaderSignOutButtons() {
    const router = useRouter()
    return (
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <Button
                variant='contained'
                sx={{ textTransform: 'capitalize', fontSize: 20, borderRadius: 28 }}
                data-cy='sign-out-button'
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        </Box>
    )

    function handleSignOut() {
        signOut({ callbackUrl: '/login' }).catch((err) => {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        })
    }
}
