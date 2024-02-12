'use client'

import { Icon, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import React from 'react'
import { theme } from '@/components/ThemeRegistry/theme'

export default function AddButton() {
    return (
        <IconButton sx={{
            color: '#ffffff', backgroundColor: theme.palette.primary.main, '&:hover': {
                color: '#ffffff', backgroundColor: theme.palette.primary.main,
            },
        }} type='submit' data-cy='add'>
            <Icon>
                <Add />
            </Icon>
        </IconButton>
    )
}
