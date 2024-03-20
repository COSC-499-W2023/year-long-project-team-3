import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import React from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export default function ResetPasswordPage() {
    return (
        <Box
            sx={{
                py: '2rem',
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <ResetPasswordForm/>
        </Box>
    )
}
