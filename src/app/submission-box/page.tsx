'use client'

import React, { ReactElement, useState } from 'react'
import { useMultiStepForm } from '@/utils/useMultiStepForm'
import Settings from '@/components/SubmissionBoxComponents/Settings'
import RequestSubmission from '@/components/SubmissionBoxComponents/RequestSubmission'
import ReviewAndCreate from '@/components/SubmissionBoxComponents/ReviewAndCreate'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'

type FormData = {
    title: string
    description: string | undefined
    closingDate: Date | undefined
    emails: string[]
}

const INITIAL_DATA: FormData = {
    title: '',
    description: '',
    closingDate: undefined,
    emails: [],
}

export default function SubmissionBox() {
    const session = useSession()
    const [data, setData] = useState(INITIAL_DATA)

    function updateFields(fields: Partial<FormData>) {
        setData((prev) => {
            return { ...prev, ...fields }
        })
    }

    const { steps, currentStepIndex, step, stepTitles, currentStepTitle, isFirstStep, isLastStep, back, next } =
        useMultiStepForm(
            [
                <Settings key='step1' {...data} updateFields={updateFields} />,
                <RequestSubmission key='step2' {...data} updateFields={updateFields} />,
                <ReviewAndCreate key='step3' {...data} />,
            ],
            ['Settings', 'Request Submissions', 'Review & Create']
        )

    return (
        <>
            <Header {...session} />
            <BackButton route={'/dashboard '} /> {/* TODO: make this route to correct page */}
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
                <Box
                    sx={{
                        minWidth: '16rem',
                        width: '50%',
                    }}
                >
                    <ProgressDots activeStep={currentStepIndex} numSteps={steps.length} labels={stepTitles} />
                </Box>
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        {currentStepTitle}
                    </Typography>
                </Box>
                {step}
            </Box>
        </>
    )
}
