import { Box } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import React from 'react'

// TODO: Implement this component (right now it's only a bare bones version for testing)

type ReviewAndCreateData = {
    title: string
    description: string | undefined
    closingDate: Date | undefined
    emails: string[]
}

export default function ReviewAndCreate({ title, description, closingDate, emails }: ReviewAndCreateData) {
    return (
        <>
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
                <Typography>{title}</Typography>
                <Typography>{description}</Typography>
                <Typography>{JSON.stringify(closingDate)}</Typography>
                {emails.map((email, index) => (
                    <Typography key={index} variant='body1'>
                        {email}
                    </Typography>
                ))}
            </Box>
        </>
    )
}
