'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import logger from '@/utils/logger'
import SubmissionBoxList from '@/components/SubmissionBoxList'

export default function SubmissionInboxPage() {
    const session = useSession()
    const [myBoxes, setMyBoxes] = useState<any>()
    const [hasSubmissions, setHasSubmissions] = useState(false)

    useEffect(() => {
        async function fetchSubmissionInboxes() {
            const response = await fetch('/api/submission-box/myboxes')
            const myBoxes = await response.json()
            if (myBoxes.submissionBoxes.length > 0) {
                setHasSubmissions(true)
            }
            setMyBoxes(myBoxes.submissionBoxes)
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
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <Dashboard userEmail={'test'} initialSidebarSelectedOption={'submission_boxes_my_boxes'} />
                <Box>
                    <Typography
                        data-cy='title'
                        variant='h5'
                        color={'textSecondary'}
                        sx={{ m: 2, fontWeight: 'bold', py: '1rem' }}
                    >
                        My Boxes
                    </Typography>
                    <Box
                        component='section'
                        sx={{ borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 602, backgroundColor: 'secondary.lighter' }}
                        border={1}
                        borderColor={'secondary.lighter'}
                    >
                        {!hasSubmissions && (
                            <Typography
                                data-cy='no submission text'
                                variant='h5'
                                align='center'
                                color={'textSecondary'}
                                sx={{ mt: 20 }}
                            >
                                You Do Not Have Any Active Submission Boxes
                            </Typography>
                        )}
                        {hasSubmissions && <SubmissionBoxList submissionBoxes={myBoxes} />}
                    </Box>
                </Box>
            </Box>
        </>
    )
}
