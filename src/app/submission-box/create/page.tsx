'use client'

import React, { useState } from 'react'
import { useMultiStepForm } from '@/utils/useMultiStepForm'
import SubmissionBoxSettings, { validationSchema as settingsValidationSchema } from '@/components/SubmissionBoxSettings'
import SubmissionBoxRequestSubmission from '@/components/SubmissionBoxRequestSubmission'
import SubmissionBoxReviewAndCreate from '@/components/SubmissionBoxReviewAndCreate'
import BackButtonWithLink from '@/components/BackButtonWithLink'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import FormNavButton from '@/components/FormNavButton'

export default function SubmissionBox() {
    const router = useRouter()

    const [title, setTitle] = useState<string>('')
    const [isTitleError, setIsTitleError] = useState<boolean>(false)
    const [description, setDescription] = useState<string | undefined>()
    const [closingDate, setClosingDate] = useState<Date | null>(null)
    const [emails, setEmails] = useState<string[]>([])
    const [emailFieldText, setEmailFieldText] = useState<string>('')
    const [popUpVisible, setPopupVisible] = useState<boolean>(false)

    const { steps, currentStepIndex, step, stepTitles, currentStepTitle, isFirstStep, isLastStep, back, next } =
        useMultiStepForm(
            [
                <SubmissionBoxSettings
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
                <SubmissionBoxRequestSubmission key='step2' emails={emails} setEmails={setEmails} setEmailFieldText={setEmailFieldText}/>,
                <SubmissionBoxReviewAndCreate
                    key='step3'
                    title={title}
                    description={description}
                    closingDate={closingDate}
                    emails={emails}
                />,
            ],
            ['Box Settings', 'Request Submissions', 'Review & Create']
        )

    return (
        <>
            <BackButtonWithLink route={'/dashboard?tab=manage-boxes'} title={'Return to Dashboard'} />{' '}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    height: '100%',
                    pb: '2rem',
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
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
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
                            width: '20rem',
                            justifyContent: isFirstStep ? 'center' : 'space-between',
                        }}
                    >
                        {!isFirstStep && (
                            <FormNavButton title={'Back'} variant={'outlined'} handleClick={back}></FormNavButton>
                        )}
                        <FormNavButton
                            title={isLastStep ? 'Create' : 'Next'}
                            variant={'contained'}
                            handleClick={handleNext}
                        ></FormNavButton>
                    </Box>
                </Box>
            </Box>
            <Dialog
                open={popUpVisible}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                sx={{ pt: 21 }}
                data-cy='pop-up'
            >
                <DialogTitle id='alert-dialog-title'>
                    Continue without adding the entered email?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                      You have not added the email you entered into the email addresses field. Are you sure you want to
                      move on to the next page without adding it?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button data-cy='close' onClick={handleClose}>No</Button>
                    <Button data-cy='agree' onClick={handleAgree} autoFocus>Yes, I am sure</Button>
                </DialogActions>
            </Dialog>
        </>
    )

    async function handleNext() {
        if (!isLastStep) {
            if (currentStepIndex === 0) {
                const validationResult = await validateFormData()
                setIsTitleError(!validationResult)
                return next(validationResult)
            } else if (currentStepIndex === 1) {
                // On SubmissionBoxRequestSubmission, check whether there is text in the email field
                const emailFieldHasText = emailFieldText.trim() == ''
                setPopupVisible(!emailFieldHasText)
                return next(emailFieldHasText)
            }

            // Reset state storing text in email field
            setEmailFieldText('')

            // Handle other steps
            return next(true)
        }
        handleCreate().then()
    }

    // TODO: adapt once api has been implemented
    async function handleCreate() {
        try {
            const response = await fetch('/api/submission-box/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    description: description,
                    closesAt: closingDate,
                    requestedEmails: emails,
                }),
            })

            const submissionBoxInfo = await response.json()
            if (response.status == 201) {
                toast.success(`Submission box ${ submissionBoxInfo.title } successfully created!`)
                logger.info(`Submission box with title ${ submissionBoxInfo.title } successfully created`)
                router.push('/submission-box/' + submissionBoxInfo.id)
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

    // If the user clicks: No in the popup
    function handleClose() {
        setPopupVisible(false)
    }

    // If the user clicks: Yes, I am sure in the popup
    function handleAgree() {
        setPopupVisible(false)
        return next(true)
    }
}
