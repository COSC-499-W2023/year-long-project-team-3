import SignOut from '@/components/UserAccountNav/SignOut'
import SignIn from '@/components/UserAccountNav/SignIn'
import { AppBar, Toolbar, Typography } from '@mui/material'
import LogoNav from './LogoNav'
import { type SessionContextValue, useSession } from 'next-auth/react'

export type UserAccountNavProps = {} & SessionContextValue

export default function UserAccountNav(props: UserAccountNavProps) {
    const { status } = props

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <LogoNav></LogoNav>
                <Typography color='primary' variant='h4' component='div' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Harp
                </Typography>
                {status === 'authenticated' ? <SignOut /> : <SignIn />}
            </Toolbar>
        </AppBar>
    )
}
