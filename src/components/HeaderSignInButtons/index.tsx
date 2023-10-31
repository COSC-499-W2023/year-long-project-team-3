'use client'

import { useRouter } from 'next/navigation'
import { Box, Button } from '@mui/material'

export default function HeaderSignInButtons() {
    const router = useRouter()
    return (
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <Button
                sx={{ textTransform: 'capitalize', fontSize: 20, fontWeight: 'bold', borderRadius: 28 }}
                data-cy='login-button'
                onClick={() => router.push('/login')}
            >
                Login
            </Button>
            <Button
                variant='contained'
                sx={{ textTransform: 'capitalize', fontSize: 20, borderRadius: 28 }}
                data-cy='sign-up-button'
                onClick={() => router.push('/signup')}
            >
                Sign Up
            </Button>
        </Box>
    )
}
