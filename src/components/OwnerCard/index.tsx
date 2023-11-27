import { Box, Card, CardContent, IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Remove } from '@mui/icons-material'

export type MemberCardProps = {
    ownerEmail: string
}

export default function OwnerCard(props: MemberCardProps) {
    return (
        <Card // This is the owner card, it cannot be removed
            sx={{ width: '25rem', borderRadius: 12, mb: '1rem' }}
            data-cy='owner-card'
        >
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
                >
                    {props.ownerEmail}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{ pt: 1, pr: 2 }}>Owner</Typography>
                    <IconButton disabled size='small' sx={{ mt: 1, backgroundColor: '#F5F5F5' }}>
                        <Remove />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
}
