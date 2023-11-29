'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React from 'react'
import BackButton from '@/components/BackButton'
import { Box } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'

// TODO: Implement this page (right now it's only a bare bones version for testing)
export default function SubmissionBoxReviewAndCreatePage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
            <BackButton route={'/dashboard '} /> {/* TODO: make this route to correct page */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        minWidth: '16rem',
                        width: '50%',
                    }}
                >
                    <ProgressDots
                        activeStep={2}
                        numSteps={3}
                        labels={['Settings', 'Request Submissions', 'Review & Create']}
                    />
                </Box>
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Review & Create
                    </Typography>
                </Box>
            </Box>
        </>
    )
}
