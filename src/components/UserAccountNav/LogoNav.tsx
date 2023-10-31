'use client'

import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import { useRouter } from 'next/navigation'

const LogoNav = () => {
    const router = useRouter()
    return (
        <Box sx={{ m: 2 }} onClick={() => router.push('/')}>
            <Logo fontSize={30} />
        </Box>
    )
}

export default LogoNav
