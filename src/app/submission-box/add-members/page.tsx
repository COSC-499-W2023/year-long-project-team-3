'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React from 'react'
import { Box, Icon, IconButton } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import logger from '@/utils/logger'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'

interface FormValues {
    email: string | undefined
}

export default function SubmissionBoxAddMembersPage() {
    const session = useSession()
    const router = useRouter()

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
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
                    <ProgressDots activeStep={1} numSteps={3} labels={['Settings', 'Add Members', 'Create']} />
                </Box>
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Add Members
                    </Typography>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <Box
                            sx={{
                                p: 5,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                minWidth: 'md',
                                '& .MuiTextField-root': { my: 1.5, mx: 2, width: '100%' },
                            }}
                        >
                            <TextField
                                margin='normal'
                                variant='outlined'
                                type='email'
                                label='Email Address'
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                // this ensures the layout does not get shifted by the helper text
                                FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                helperText={formik.touched.email && formik.errors.email}
                                data-cy='email'
                            />
                            <IconButton type='submit'>
                                <Icon>+</Icon>
                            </IconButton>
                        </Box>
                    </form>
                    <Button
                        variant='contained'
                        sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        data-cy='next'
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </>
    )

    async function handleSubmit() {
        try {
            // TODO: send form data to API and do some error checking here
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email'),
})
