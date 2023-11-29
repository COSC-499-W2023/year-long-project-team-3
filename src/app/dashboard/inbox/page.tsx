'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import logger from '@/utils/logger'

export default function SubmissionInboxPage() {
    const session = useSession()
    const [submissionInboxes, setSubmissionInboxes] = useState([
        {
            id: 123,
            title: 'null',
            description: null,
            createdAt: null,
            closesAt: null,
            videoStoreToDate: null,
            maxVideoLength: null,
            isPublic: false,
        },
    ])
    const [hasSubmissions, setHasSubmissions] = useState(false)

    useEffect(() => {
        async function fetchSubmissionInboxes() {
            const response = await fetch('/api/submission-box/inboxes')
            const submissionInboxes = await response.json()
            if (submissionInboxes.length > 0) {
                setSubmissionInboxes(submissionInboxes)
                setHasSubmissions(true)
            }
            // TODO: Handle retrieved submission inboxes
        }

        fetchSubmissionInboxes()
            .then(() => {})
            .catch((error) => {
                logger.error(error)
            })
    }, [])

    console.log(submissionInboxes)
    return (
        <>
            <Header {...session} />
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <Dashboard userEmail={'test'} initialSidebarSelectedOption={'submission_boxes_inbox'} />
                <Box >
                    <Typography data-cy='title' variant='h5' color={'textSecondary'} sx={{ m: 2, fontWeight: 'bold' }}>
                        Submission In-Box
                    </Typography>
                    <Box
                        component='section'
                        sx={{ p: 2, borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 1 }}
                        border={1}
                        borderColor={'textSecondary'}
                    >
                        <ul>
                            {submissionInboxes.map((submissionBox, id: React.Key) => (
                                <li key={id}>
                                    <Box border={1} borderColor={'textSecondary'}>
                                        <Typography>{submissionBox.title}</Typography>
                                    </Box>
                                </li>
                            ))}
                        </ul>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
