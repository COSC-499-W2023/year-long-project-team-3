'use client'

import { Box } from '@mui/material'
import Logo from '@/components/Logo'

const HeaderLogo = () => {
    return (
        <Box sx={{ m: 2 }}>
            <Logo fontSize={40} />
        </Box>
    )
}

export default HeaderLogo
