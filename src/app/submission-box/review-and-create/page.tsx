'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React from 'react'
import logger from '@/utils/logger'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// TODO: Implement this page (right now it's only a bare bones version for testing)

interface FormValues {
    title: string
    description: string | undefined
    closingDate: Date | undefined
    requestedEmails: string[]
}

export default function SubmissionBoxReviewAndCreatePage() {
    const session = useSession()
    const router = useRouter()

    const dummyFormData: FormValues = generateDummyFormData()

    return (
        <>
            <>
                <Header {...session} />
            </>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Create Submission Box
                    </Typography>
                    <Button
                        variant='contained'
                        sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        onClick={() => handleSubmit(dummyFormData)}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </>
    )

    async function handleSubmit(values: FormValues) {
        try {
            // TODO: send form data to API and do some error checking here
            console.log(values)
            const response = await fetch('api/submission-box/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    closingDate: values.closingDate,
                    requestedEmails: values.requestedEmails,
                }),
            })

            const submissionBoxInfo = await response.json()
            if (response.status == 201) {
                logger.info(`Submission box with title ${ submissionBoxInfo.title } successfully created`)
                router.push('/dashboard')
                router.refresh()
            } else {
                toast.error(submissionBoxInfo.error)
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

function generateDummyFormData(): FormValues {
    return {
        title: 'Sample Title',
        description: 'Sample Description',
        closingDate: new Date('11/30/2023 06:30 AM'),
        requestedEmails: ['email1@example.com', 'email2@example.com'],
    }
}
