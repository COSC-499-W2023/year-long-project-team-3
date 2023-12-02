'use client'

import { Box } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRouter } from 'next/navigation'

export type BackButtonProps = {
    route: string
    title: string
}

export default function BackButton(props: BackButtonProps) {
    const router = useRouter()

    function handleGoBack() {
        router.push(props.route)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                m: 2,
                cursor: 'pointer',
                color: '#757575',
            }}
            onClick={handleGoBack}
            data-cy='back-button'
        >
            <ArrowBack />
            <Typography variant='h6' sx={{ ml: 1 }}>
                {props.title}
            </Typography>
        </Box>
    )
}
