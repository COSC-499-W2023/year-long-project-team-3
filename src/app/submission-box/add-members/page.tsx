'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React from 'react'
import { Box } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'

export default function SubmissionBoxAddMembersPage() {
    const session = useSession()
    return (
        <>
            <Header {...session} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    height: '100%',
                    padding: '2rem',
                }}
            >
                <Box
                    sx={{
                        minWidth: '16rem',
                        width: '50%',
                    }}
                >
                    <ProgressDots activeStep={1} numSteps={3} labels={['Settings', 'Add Members', 'Create']} />
                </Box>
            </Box>
        </>
    )
}
