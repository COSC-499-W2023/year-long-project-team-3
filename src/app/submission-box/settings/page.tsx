'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import ProgressDots from '@/components/ProgressDots'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import logger from '@/utils/logger'
import { DateTimePicker } from '@mui/x-date-pickers'
import Button from '@mui/material/Button'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'

interface FormValues {
    title: string
    description: string | undefined
    closingDate: Date | undefined
}

export default function SubmissionBoxSettingsPage() {
    const session = useSession()
    const router = useRouter()

    const formik = useFormik<FormValues>({
        initialValues: {
            title: '',
            description: '',
            closingDate: undefined,
        },
        validationSchema: validationSchema,
        // TODO
        onSubmit: () => handleSubmit(),
    })

    return (
        <>
            <Header {...session} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    height: '100%',
                    padding: '2rem',
                }}
            >
                <Box
                    sx={{
                        minWidth: '16rem',
                        width: '50%',
                    }}
                >
                    <ProgressDots activeStep={0} numSteps={3} labels={['Settings', 'Add Members', 'Create']} />
                </Box>
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Settings
                    </Typography>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <Box
                            gap={1}
                            sx={{
                                p: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: 'md',
                                '& .MuiTextField-root': { my: 1.5, mx: 7, width: '80%' },
                            }}
                        >
                            <TextField
                                margin='normal'
                                variant='outlined'
                                type='title'
                                label='Title'
                                name='title'
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                // this ensures the layout does not get shifted by the helper text
                                FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                helperText={formik.touched.title && formik.errors.title}
                                data-cy='submission-box-title'
                            />
                            <TextField
                                margin='normal'
                                variant='outlined'
                                type='description'
                                label='Description (optional)'
                                name='description'
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                // this ensures the layout does not get shifted by the helper text
                                FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                helperText={formik.touched.description && formik.errors.description}
                                data-cy='description'
                            />
                            <DateTimePicker label='Closing Date' />
                            <Button
                                type='submit'
                                variant='contained'
                                sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                                data-cy='next'
                            >
                                Next
                            </Button>
                            <Box sx={{ width: '90%' }}>
                                <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                    You will be able to add members to your box in the next step!
                                </Typography>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    )

    async function handleSubmit() {
        try {
            // TODO: send form data to API and do some error checking here
            router.push('/submission-box/add-members')
            router.refresh()
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
    title: yup.string().required('Please enter a title for your submission box'),
    description: yup.string(),
    closingDate: yup.date(),
})
