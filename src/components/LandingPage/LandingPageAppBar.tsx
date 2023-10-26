import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import Logo from '@/components/Logo/logo'

export default function LandingPageAppBar() {
    return (
        <AppBar position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <Box sx={{ m: 2 }}>
                    <Logo fontSize={30} />
                </Box>
                <Typography color='primary' variant='h4' component='div' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Harp
                </Typography>
                <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', gap: '16px' }}>
                    <Button sx={{ textTransform: 'capitalize', fontSize: 20 }}>Login</Button>
                    <Button variant='contained' sx={{ textTransform: 'capitalize', fontSize: 20, borderRadius: 28 }}>
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
