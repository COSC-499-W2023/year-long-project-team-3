import { Box, Typography } from '@mui/material'
import Logo from '@/components/Logo/logo'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
import HomePageButton from '@/components/HomePageButton'
export default function Home() {
    return (
        <>
            <UserAccountNav></UserAccountNav>
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
                    <HomePageButton route='/dashboard' text='Get Started'></HomePageButton>
                    <HomePageButton route='/' text='Find Out More'></HomePageButton>
                </Box>
            </Box>
        </>
    )
}
