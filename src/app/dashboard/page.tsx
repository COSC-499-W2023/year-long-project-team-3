import Box from '@mui/material/Box'
import Logo from '@/components/Logo/logo'
import Typography from '@mui/material/Typography'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'

const page = () => {
    return (
        <>
            <UserAccountNav></UserAccountNav>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant='h4' sx={{ fontWeight: 'medium' }}>
                    Welcome to the dashboard!
                </Typography>
            </Box>
        </>
    )
}

export default page
