import { Box, Card, CardContent, IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Remove } from '@mui/icons-material'
import React from 'react'

export type SubmissionMemberCardProps = {
    email: string
    role: string
    isRemovable: boolean
    removeEmail: (email: string) => void
}

export default function SubmissionMemberCard(props: SubmissionMemberCardProps) {
    return (
        <Card sx={{ width: '25rem', borderRadius: 12, mb: '1rem' }}>
            <CardContent
                sx={{
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    sx={{
                        pt: 1,
                        maxWidth: '70%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    data-cy='email'
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
                    <Typography sx={{ pt: 1, pr: 2 }} data-cy='role'>
                        {props.role}
                    </Typography>
                    <IconButton
                        disabled={props.isRemovable}
                        size='small'
                        sx={{ mt: 1, backgroundColor: '#F5F5F5' }}
                        onClick={() => props.removeEmail(props.email)}
                        data-cy='remove'
                    >
                        <Remove />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
}
