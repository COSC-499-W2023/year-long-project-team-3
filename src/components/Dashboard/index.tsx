'use client'

import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
import Box from '@mui/material/Box'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'
import { type SessionContextValue, useSession } from 'next-auth/react'

export type DashboardPageProps = {
    userEmail: string
}

export default function DashboardPage(props: DashboardPageProps) {
    const session: SessionContextValue = useSession()

    return (
        <>
            <UserAccountNav {...session} />
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
                <Typography data-cy='dashboard-message' variant='h4' sx={{ fontWeight: 'medium' }}>
                    Welcome to the dashboard, {props.userEmail}!
                </Typography>
            </Box>
        </>
    )
}
