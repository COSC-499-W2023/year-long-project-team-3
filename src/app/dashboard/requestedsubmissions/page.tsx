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
    const [requestedSubmissions, setRequestedSubmissions] = useState<any>()
    const [hasSubmissions, setHasSubmissions] = useState(false)

    useEffect(() => {
        async function fetchRequestedSubmissions() {
            const response = await fetch('/api/submission-box/requestedsubmissions')
            const requestedSubmissions = await response.json()
            if (requestedSubmissions.submissionBoxes.length > 0) {
                setHasSubmissions(true)
            }
            setRequestedSubmissions(requestedSubmissions.submissionBoxes)
        }

        fetchRequestedSubmissions()
            .then(() => {})
            .catch((error) => {
                logger.error(error)
            })
    }, [])

    return (
        <>
            <Header {...session} />
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <Dashboard userEmail={'test'} initialSidebarSelectedOption={'requested_submission_boxes'} />
                <Box>
                    <Typography data-cy='title' variant='h5' color={'textSecondary'} sx={{ m: 2, fontWeight: 'bold', py: '1rem' }}>
                        Submission Out-Box
                    </Typography>
                    <Box
                        component='section'
                        sx={{ borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 602 }}
                        border={1}
                        borderColor={'textSecondary'}
                    >
                        {!hasSubmissions && (
                            <Typography data-cy='no submission text' variant='h5' align='center' color={'textSecondary'} sx={{ mt: 20 }}>
                                You Have Not Submitted To Any Active Submission Boxes
                            </Typography>
                        )}
                        {hasSubmissions && <SubmissionBoxList submissionBoxes={requestedSubmissions} />}
                    </Box>
                </Box>
            </Box>
        </>
    )
}