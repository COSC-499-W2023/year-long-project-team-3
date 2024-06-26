'use client'

import HeaderSignOutButtons from '@/components/HeaderSignOutButtons'
import HeaderSignInButtons from '@/components/HeaderSignInButtons'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import HeaderLogo from '../HeaderLogo'
import { type SessionContextValue, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Header() {
    const session = useSession()
    const { status } = session
    const router = useRouter()

    return (
        <AppBar data-cy='landing-page-app-bar' position='sticky' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={handleLogoClick}
                    >
                        <HeaderLogo />
                        <Typography color='primary' variant='h4' component='div' sx={{ fontWeight: 'bold' }}>
                            Harp
                        </Typography>
                    </Box>
                    <Box sx={{ width: '1px', height: '2rem', backgroundColor: 'grey.300' }} />
                    <Typography
                        color='primary'
                        component='div'
                        sx={{ fontWeight: 700, fontSize: '1.3rem' }}
                        onClick={handleOnDashboardTabClick}
                        data-cy='dashboard-tab'
                    >
                        Dashboard
                    </Typography>
                    <Box sx={{ width: '1px', height: '2rem', backgroundColor: 'grey.300' }} />
                    <Typography
                        color='primary'
                        component='div'
                        sx={{ fontWeight: 700, fontSize: '1.3rem' }}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        gap='0.5rem'
                        onClick={handleOnLearnMoreTabClick}
                        data-cy='learn-more-tab'
                    >
                        Learn More
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {status === 'authenticated' ? <HeaderSignOutButtons /> : <HeaderSignInButtons />}
            </Toolbar>
        </AppBar>
    )

    function handleLogoClick() {
        router.push('/')
    }

    function handleOnDashboardTabClick() {
        router.push('/dashboard')
    }

    function handleOnLearnMoreTabClick() {
        router.push('/learn-more')
    }
}
