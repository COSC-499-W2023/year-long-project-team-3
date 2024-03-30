import ResetPasswordForm from '@/components/ResetPasswordForm'
import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import React from 'react'

type ResetPasswordProps = {
    params: {
        resetPasswordId: string
    }
}

export default function ResetPassword({ params }: ResetPasswordProps) {
    const { resetPasswordId } = params

    return (
        <Box
            sx={{
                py: '2rem',
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <ResetPasswordForm  resetPasswordId={resetPasswordId}/>
        </Box>
    )
}
