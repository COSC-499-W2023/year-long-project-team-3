'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import Logo from '@/components/Logo'

export default function SubmissionOutBoxPage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <Dashboard userEmail={'test'} />
                <Box
                    sx={{
                        marginTop: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '75%',
                    }}
                >
                    <Logo fontSize={80} />
                    <Typography data-cy='dashboard-message' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Welcome to the dashboard, {session.data?.user?.email!}!
                    </Typography>
                </Box>
            </Box>
        </>
    )
}
