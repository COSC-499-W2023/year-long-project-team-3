'use client'

import React, { useState } from 'react'
import { useMultiStepForm } from '@/utils/useMultiStepForm'
import Settings, { validationSchema as settingsValidationSchema } from '@/components/SubmissionBoxComponents/Settings'
import RequestSubmission from '@/components/SubmissionBoxComponents/RequestSubmission'
import ReviewAndCreate from '@/components/SubmissionBoxComponents/ReviewAndCreate'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Box, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function SubmissionBox() {
    const session = useSession()
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [isTitleError, setIsTitleError] = useState(false)
    const [description, setDescription] = useState<string | undefined>()
    const [closingDate, setClosingDate] = useState<Date | null | undefined>()
    const [emails, setEmails] = useState<string[]>([])

    const { steps, currentStepIndex, step, stepTitles, currentStepTitle, isFirstStep, isLastStep, back, next } =
        useMultiStepForm(
            [
                <Settings
                    key='step1'
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    closingDate={closingDate}
                    setClosingDate={setClosingDate}
                    isTitleError={isTitleError}
                    setIsTitleError={setIsTitleError}
                />,
                <RequestSubmission key='step2' emails={emails} setEmails={setEmails} />,
                <ReviewAndCreate
                    key='step3'
                    title={title}
                    description={description}
                    closingDate={closingDate}
                    emails={emails}
                />,
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
                <Box display='flex' width='100%' flexDirection='column' alignItems='center'>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        {currentStepTitle}
                    </Typography>
                    {step}
                    <Box
                        gap={1}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {!isFirstStep && (
                            <Button
                                type='button'
                                variant='outlined'
                                sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                                data-cy='back'
                                onClick={back}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type='button'
                            variant='contained'
                            sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                            data-cy='next'
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Create' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )

    async function handleNext() {
        if (!isLastStep) {
            if (currentStepIndex === 0) {
                const validationResult = await validateFormData()
                setIsTitleError(!validationResult)
                return next(validationResult)
            }

            // TODO: Handle other steps
            return next(true)
        }
        handleCreate().then()
    }

    // TODO: adapt once api has been implemented
    async function handleCreate() {
        try {
            const response = await fetch('api/submission-box/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    description: description,
                    closingDate: closingDate,
                    requestedEmails: emails,
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

    function validateFormData() {
        const formData = {
            title,
            description,
            closingDate,
            emails,
        }

        return settingsValidationSchema.isValid(formData)
    }
}
