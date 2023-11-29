'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import logger from '@/utils/logger'

export default function SubmissionOutboxPage() {
    const session = useSession()

    useEffect(() => {
        async function fetchSubmissionOutboxes() {
            const response = await fetch('/api/submission-box/outboxes')
            const submissionOutboxes = await response.json()
            console.log(submissionOutboxes)
            // TODO: Handle retrieved submission outboxes
        }

        fetchSubmissionOutboxes()
            .then(() => {})
            .catch((error) => {
                logger.error(error)
            })
    }, [])

    return (
        <>
            <Header {...session} />
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <Dashboard userEmail={'test'} initialSidebarSelectedOption={'submission_boxes_outbox'} />
                <Box >
                    <Typography data-cy='title' variant='h5' color={'textSecondary'} sx={{ m: 2, fontWeight: 'bold' }}>
                        Submission Out-Box
                    </Typography>
                    <Box
                        component='section'
                        sx={{ p: 2, borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 1 }}
                        border={1}
                        borderColor={'textSecondary'}
                    />
                </Box>
            </Box>
        </>
    )
}
