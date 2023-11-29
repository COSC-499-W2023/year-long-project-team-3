import { Box, Card, CardContent, IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Remove } from '@mui/icons-material'
import React from 'react'

export type SubmissionRequestedCardProps = {
    email: string
    removeEmail: (email: string) => void
}

export default function SubmissionRequestedCard(props: SubmissionRequestedCardProps) {
    const handleClick = (email: string) => {
        props.removeEmail(email)
    }

    return (
        <Card sx={{ width: '25rem', borderRadius: 12, mb: '1rem' }} data-cy='card'>
            <CardContent
                sx={{
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                data-cy='card-content'
            >
                <Typography
                    sx={{
                        pt: 1,
                        maxWidth: '70%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    data-cy='requested-email'
                >
                    {props.email}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        size='small'
                        sx={{ mt: 1, backgroundColor: '#F5F5F5' }}
                        onClick={() => handleClick(props.email)}
                        data-cy='remove'
                    >
                        <Remove />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
}
