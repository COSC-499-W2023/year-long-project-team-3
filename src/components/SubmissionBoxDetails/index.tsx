'use client'

import Typography from '@mui/material/Typography'
import React from 'react'
import { SubmissionBox } from '@prisma/client'

export type SubmissionBoxInfoProps = {
    submissionBox: SubmissionBox | null
}
export default function SubmissionBoxDetails(props: SubmissionBoxInfoProps) {
    return (
        <>
            <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ m: 1 }}>
                Title
            </Typography>
            <Typography
                data-cy='submissionBoxTitle'
                variant='h5'
                color={'textSecondary'}
                paddingBottom='2rem'
                sx={{ m: 1, fontWeight: 'bold' }}
            >
                {props.submissionBox ? props.submissionBox.title : 'N/A'}
            </Typography>
            <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ m: 1 }}>
                Close Date:
            </Typography>
            <Typography
                data-cy='submissionBoxDate'
                variant='h6'
                color={'textSecondary'}
                paddingBottom='2rem'
                paddingLeft='1rem'
                sx={{ m: 1 }}
            >
                {props.submissionBox
                    ? !!props.submissionBox.closesAt
                        ? new Date(props.submissionBox.closesAt).toDateString().slice(4)
                        : 'N/A'
                    : 'N/A'}
            </Typography>
            <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ m: 1 }}>
                Description
            </Typography>
            <Typography
                data-cy='submissionBoxDesc'
                variant='subtitle2'
                color={'textSecondary'}
                paddingBottom='2rem'
                paddingLeft='1rem'
                sx={{ m: 1 }}
            >
                {props.submissionBox ? props.submissionBox.description ?? 'N/A' : 'N/A'}
            </Typography>
        </>
    )
}