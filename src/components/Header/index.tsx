import HeaderSignOutButtons from '@/components/HeaderSignOutButtons'
import HeaderSignInButtons from '@/components/HeaderSignInButtons'
import { AppBar, Toolbar, Typography } from '@mui/material'
import HeaderLogo from '../HeaderLogo'
import { type SessionContextValue, useSession } from 'next-auth/react'

export type HeaderProps = {} & SessionContextValue

export default function Header(props: HeaderProps) {
    const { status } = props

    return (
        <AppBar data-cy='landing-page-app-bar' position='static' sx={{ backgroundColor: 'white' }}>
            <Toolbar disableGutters>
                <HeaderLogo />
                <Typography color='primary' variant='h4' component='div' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Harp
                </Typography>
                {status === 'authenticated' ? <HeaderSignOutButtons /> : <HeaderSignInButtons />}
            </Toolbar>
        </AppBar>
    )
}
