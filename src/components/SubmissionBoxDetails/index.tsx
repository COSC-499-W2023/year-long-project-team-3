'use client'

import Typography from '@mui/material/Typography'
import React from 'react'
import { SubmissionBox } from '@prisma/client'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'

export type SubmissionBoxInfoProps = {
    submissionBox: SubmissionBox | null
    onUnsubmit?: () => void
}
export default function SubmissionBoxDetails(props: SubmissionBoxInfoProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}
        >
            <Box>
                <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                    Submission Box Title
                </Typography>
                <Typography
                    data-cy='submissionBoxTitle'
                    variant='h5'
                    color={'textSecondary'}
                    sx={{ fontWeight: 'bold' }}
                >
                    {props.submissionBox ? props.submissionBox.title : 'N/A'}
                </Typography>
            </Box>
            {props.submissionBox && props.submissionBox.closesAt && (
                <Box>
                    <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                        Close Date
                    </Typography>
                    <Typography
                        data-cy='submissionBoxDate'
                        variant={'subtitle2'}
                        color={'textSecondary'}
                    >
                        {new Date(props.submissionBox.closesAt).toDateString().slice(4)}
                    </Typography>
                </Box>
            )}
            {props.submissionBox && props.submissionBox.description && (
                <Box>
                    <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                        Description
                    </Typography>
                    <Typography
                        data-cy='submissionBoxDesc'
                        variant='subtitle2'
                        color={'textSecondary'}
                        sx={{ maxHeight: '30rem', overflow: 'auto' }}
                    >
                        {props.submissionBox.description}
                    </Typography>
                </Box>
            )}
            {props.onUnsubmit && (
                <Box
                    sx={{
                        mt: '2rem',
                    }}
                >
                    <Button
                        variant='contained'
                        onClick={props.onUnsubmit}
                        color='error'
                        data-cy='unsubmit-button'
                    >Unsubmit Video</Button>
                </Box>
            )}
        </Box>
    )
}
