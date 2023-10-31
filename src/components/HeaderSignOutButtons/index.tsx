'use client'

import { Box, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function HeaderSignOutButtons() {
    useRouter()
    return (
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <Button
                variant='contained'
                sx={{ textTransform: 'capitalize', fontSize: 20, borderRadius: 28 }}
                data-cy='sign-out-button'
                onClick={() => signOut()}
            >
                Sign Out
            </Button>
        </Box>
    )
}
