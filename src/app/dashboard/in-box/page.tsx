'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import logger from '@/utils/logger'

export default function SubmissionInBoxPage() {
    const session = useSession()

    useEffect(() => {
        async function fetchSubmissionInboxes() {
            const response = await fetch('/api/submission-box/inboxes')
            const submissionInboxes = await response.json()
            // TODO: Handle retrieved submission inboxes
        }

        fetchSubmissionInboxes()
            .then(() => {})
            .catch((error) => {
                logger.error(error)
            })
    }, [])

    return (
        <>
            <Header {...session} />
            <Box sx={{ display: 'fixed', flexDirection: 'row' }}>
                <Dashboard userEmail={'test'} initialSidebarSelectedOption={'submission_boxes_inbox'} />
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: { md: '60%', lg: '70%', xl: '75%' } }}>
                    <Typography data-cy='title' variant='h5' color={'textSecondary'} sx={{ m: 2, fontWeight: 'bold' }}>
                        Submission In-Box
                    </Typography>
                    <Box
                        component='section'
                        sx={{ p: 2, borderRadius: 0.5, height: 1 }}
                        border={1}
                        borderColor={'textSecondary'}
                    />
                </Box>
            </Box>
        </>
    )
}
