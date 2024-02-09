'use client'

import { Icon, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import React from 'react'

export default function AddButton() {
    return (
        <IconButton sx={{
            color: '#ffffff', backgroundColor: '#367bf4', '&:hover': {
                color: '#ffffff', backgroundColor: '#367bf4',
            },
        }} type='submit' data-cy='add'>
            <Icon>
                <Add />
            </Icon>
        </IconButton>
    )
}
