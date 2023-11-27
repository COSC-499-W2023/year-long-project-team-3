'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function SubmissionInBoxPage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
            <Box sx = {{display: 'fixed', flexDirection: 'row'}}>
                <Dashboard userEmail={'test'} />
                <Box sx = {{display: 'flex', flexDirection: 'column', minWidth: '75%'}}>
                    <Typography data-cy='title' variant='h5' color={'textSecondary'} sx={{ m: 2, fontWeight: 'bold' }}>
                    Submission In-Box
                    </Typography>
                    <Box component='section' sx={{ p: 2, border: '1px solid grey', borderRadius: 5, height: 1}}>
                    </Box>
                </Box>
            </Box>
        </>
    )
}