'use client'

import {Box, Button} from '@mui/material'
import {sendEmailVerificationEmail} from '@/utils/emails/emailVerification'
import {User} from '@prisma/client'

export default function TestEmail() {
    const dummyData = {
        id: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'admin@harpvideo.ca',
        emailVerified: new Date(),
        password: 'hashedPassword123',
    }

    return (
        <>
            <Box>️⬇️⬇️ Hello, press button ⬇️⬇️</Box>
            <Button
                onClick={() => sendEmailVerificationEmail(dummyData).then(() => console.log('Email sent')).catch((e) => console.error('Failed to send email: ' + e))}
                variant={'contained'}
            >Send test email</Button>
        </>
    )
}
