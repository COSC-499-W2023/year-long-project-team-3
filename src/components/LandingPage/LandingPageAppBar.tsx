'use client'

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import Logo from '@/components/Logo/logo'
import { useRouter } from 'next/navigation'

export default function LandingPageAppBar() {
    const router = useRouter()

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <Box sx={{ m: 2 }} onClick={() => router.push('/')}>
                    <Logo fontSize={30} />
                </Box>
                <Typography color='primary' variant='h4' component='div' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Harp
                </Typography>
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
            </Toolbar>
        </AppBar>
    )
}
