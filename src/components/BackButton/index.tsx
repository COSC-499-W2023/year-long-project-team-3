'use client'

import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useRouter } from 'next/navigation'

export type BackButtonProps = {
    route: string
}

export default function BackButton(props: BackButtonProps) {
    const router = useRouter()

    function handleGoBack() {
        router.push(props.route)
    }

    return (
        <IconButton onClick={handleGoBack} sx={{ p: 2 }} data-cy='back-button'>
            <ArrowBack />
            <Typography variant='h6' sx={{ ml: 1 }}>
                Back
            </Typography>
        </IconButton>
    )
}
