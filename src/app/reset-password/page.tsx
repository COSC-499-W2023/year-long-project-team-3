import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import React from 'react'
import ResetPasswordEmailAddressForm from 'src/components/ResetPasswordEmailAddressForm'
import { cookies } from 'next/headers'

async function setEmailCookie(email: string) {
    'use server'
    const cookieStore = cookies()
    cookieStore.set('cookieMonster', email)
}

/*
    TODO: Get rid of cookies and just have user enter email again on the password reset page
    TODO: Refactor reset tokens to have modified at instead of created at
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
            <ResetPasswordEmailAddressForm setEmailCookie={setEmailCookie}/>
        </Box>
    )
}
