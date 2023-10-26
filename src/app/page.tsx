import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
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
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column', p: 4 }}>
                <Typography variant='h2' sx={{ fontWeight: 'medium' }}>
                    A Secure Platform for Anonymous Video Submission
                </Typography>
                <Typography variant='h4' sx={{ color: 'grey' }}>
                    Easily send and receive videos for professional settings with a focus on protecting your privacy
                </Typography>
                <Box sx={{ gap: '30%' }}>
                    <Button variant='contained' sx={{ borderRadius: 28 }}>
                        Get Started
                    </Button>
                    <Button variant='contained' sx={{ borderRadius: 28 }}>
                        Find Out More
                    </Button>
                </Box>
            </Box>
        </>
    )
}
