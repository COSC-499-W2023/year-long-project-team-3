'use client'

import { Box, Typography } from '@mui/material'
import Logo from '@/components/Logo'
import Header from '@/components/Header'
import LandingPageButton from 'src/components/LandingPageButton'
import { type SessionContextValue, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const session: SessionContextValue = useSession()
    const router = useRouter()

    return (
        <>
            <Header {...session} />
            <Box
                sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column', gap: '2rem', p: 6 }}
            >
                <Logo fontSize={200}></Logo>
                <Typography
                    variant='h2'
                    sx={{
                        fontWeight: 'medium',
                        maxWidth: {
                            md: undefined,
                            lg: '70%',
                            xl: '45%',
                        },
                        textAlign: 'center',
                    }}
                    data-cy='motto'
                >
                    A Secure Platform for Anonymous Video Submission
                </Typography>
                <Typography
                    variant='h4'
                    sx={{
                        color: '#9E9E9E',
                        maxWidth: {
                            md: undefined,
                            lg: '75%',
                            xl: '50%',
                        },
                        textAlign: 'center',
                    }}
                    data-cy='platform-description'
                >
                    Professional video sharing made easy, with a focus on protecting your privacy
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <LandingPageButton text='Get Started' handleOnClick={handleClickGetStarted}></LandingPageButton>
                    <LandingPageButton text='Find Out More' handleOnClick={handleClickFindOutMore}></LandingPageButton>
                </Box>
            </Box>
        </>
    )

    function handleClickGetStarted() {
        router.push('/dashboard')
    }

    function handleClickFindOutMore() {
        router.push('/find-out-more')
    }
}
