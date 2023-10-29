import { getServerSession } from 'next-auth'
import SignOut from '@/components/UserAccountNav/SignOut'
import SignIn from '@/components/UserAccountNav/SignIn'
import { AppBar, Toolbar, Typography } from '@mui/material'
import LogoNav from './LogoNav'

export default async function UserAccountNav() {
    const session = await getServerSession()

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <LogoNav></LogoNav>
                <Typography color='primary' variant='h4' component='div' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Harp
                </Typography>
                {session ? <SignOut></SignOut> : <SignIn></SignIn>}
            </Toolbar>
        </AppBar>
    )
}
