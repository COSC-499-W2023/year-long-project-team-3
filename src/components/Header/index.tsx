'use client'

import HeaderSignInButtons from '@/components/HeaderSignInButtons'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import HeaderLogo from '../HeaderLogo'
import { type SessionContextValue, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/UserAvatar'

export type HeaderProps = {} & SessionContextValue

export default function Header(props: HeaderProps) {
    const session = useSession()
    const { status } = props
    const router = useRouter()

    const handleLogoClick = () => {
        if (session.status === 'authenticated') {
            router.push('/dashboard')
        } else {
            router.push('/')
        }
    }

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
                    <HeaderLogo />
                    <Typography color='primary' variant='h4' component='div' sx={{ fontWeight: 'bold' }}>
                        Harp
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {status === 'authenticated' ? <UserAvatar /> : <HeaderSignInButtons />}
            </Toolbar>
        </AppBar>
    )
}
