import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import React from 'react'
import ResetPasswordEmailAddressForm from 'src/components/ResetPasswordEmailAddressForm'


/*
    TODO: Add tests for api and new components
 */

export default async function ResetPasswordPage() {
    return (
        <Box
            sx={{
                py: '2rem',
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <ResetPasswordEmailAddressForm/>
        </Box>
    )
}
