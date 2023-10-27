import { Box, Button, Typography } from '@mui/material'
import Logo from '@/components/Logo/logo'
import LandingPageAppBar from '@/components/LandingPage/LandingPageAppBar'

const boxCss = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
}

export default function Home() {
    return (
        <>
            <LandingPageAppBar></LandingPageAppBar>
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
                    <Button variant='contained' sx={{ fontSize: 20, borderRadius: 28, textTransform: 'capitalize' }}>
                        Get Started
                    </Button>
                    <Button variant='contained' sx={{ fontSize: 20, borderRadius: 28, textTransform: 'capitalize' }}>
                        Find Out More
                    </Button>
                </Box>
            </Box>
        </>
    )
}
