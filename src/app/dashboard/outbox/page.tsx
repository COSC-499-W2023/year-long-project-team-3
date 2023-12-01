'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import logger from '@/utils/logger'
import SubmissionBoxList from '@/components/SubmissionBoxList'

export default function SubmissionOutboxPage() {
    const session = useSession()
    const [submissionOutboxes, setSubmissionOutboxes] = useState<any>()
    const [hasSubmissions, setHasSubmissions] = useState(false)

    useEffect(() => {
        async function fetchSubmissionOutboxes() {
            const response = await fetch('/api/submission-box/outboxes')
            const submissionOutboxes = await response.json()
            if (submissionOutboxes.submissionBoxes.length > 0) {
                setHasSubmissions(true)
            }
            setSubmissionOutboxes(submissionOutboxes.submissionBoxes)
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
                        sx={{ borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 602 }}
                        border={1}
                        borderColor={'textSecondary'}
                    >
                        {!hasSubmissions && <Typography variant='h5' align='center' color={'textSecondary'} sx={{mt: 20}}>You Have Not Submitted To Any Active Submission Boxes</Typography>}
                        {hasSubmissions && <SubmissionBoxList submissionBoxes={submissionOutboxes} />}
                    </Box>
                </Box>
            </Box>
        </>
    )
}
