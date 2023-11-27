import { Card, CardContent } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

export type MemberCardProps = {
    ownerEmail: string
}

export default function OwnerCard(props: MemberCardProps) {
    return (
        <Card // This is the owner card, it cannot be removed
            sx={{ width: '25rem', borderRadius: 12, marginBottom: '1rem' }}
        >
            <CardContent sx={{ px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <Typography sx={{ pt: 1 }}>Owner</Typography>
            </CardContent>
        </Card>
    )
}
