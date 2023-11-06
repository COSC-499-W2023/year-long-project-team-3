'use client'

import HeaderSignOutButtons from '@/components/HeaderSignOutButtons'
import HeaderSignInButtons from '@/components/HeaderSignInButtons'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import HeaderLogo from '../HeaderLogo'
import { type SessionContextValue } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export type HeaderProps = {} & SessionContextValue

export default function Header(props: HeaderProps) {
    const { status } = props
    const router = useRouter()

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/')}>
                    <HeaderLogo />
                    <Typography color='primary' variant='h4' component='div' sx={{ fontWeight: 'bold' }}>
                        Harp
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {status === 'authenticated' ? <HeaderSignOutButtons /> : <HeaderSignInButtons />}
            </Toolbar>
        </AppBar>
    )
}
