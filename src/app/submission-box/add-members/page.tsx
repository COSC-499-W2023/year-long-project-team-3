'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React, { useState } from 'react'
import { Box, Card, CardContent, Icon, IconButton, Paper } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { Add, Remove } from '@mui/icons-material'
import Button from '@mui/material/Button'

interface FormValues {
    email: string
}

export default function SubmissionBoxAddMembersPage() {
    const session = useSession()
    const router = useRouter()

    const [emails, setEmails] = useState<string[]>([])

    const removeEmail = (emailToRemove: string) => {
        const updatedEmails = emails.filter((email) => email !== emailToRemove)
        setEmails(updatedEmails)
    }

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        email: yup
            .string()
            .matches(getEmailRegex(), 'Enter a valid email')
            .required('To add a member, enter their email')
            .test('unique', 'This member has already been added!', function (value) {
                return !emails.includes(value)
            }),
    })

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: { email: string }) => handleSubmit(values),
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
                                '& .MuiTextField-root': { my: 1.5, mx: 2, minWidth: '20rem', width: '100%' },
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
                                <Icon>
                                    <Add />
                                </Icon>
                            </IconButton>
                        </Box>
                    </form>
                    <Paper sx={{ maxHeight: '15rem', overflow: 'auto' }}>
                        {emails.map((email, index) => (
                            <Card key={index} sx={{ width: '25rem' }}>
                                <CardContent
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <Typography
                                        sx={{
                                            maxWidth: '70%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {email}
                                    </Typography>
                                    <IconButton onClick={() => removeEmail(email)}>
                                        <Remove />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                    <Button
                        // type='submit'
                        variant='contained'
                        sx={{ mt: 5, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        data-cy='next'
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </>
    )

    async function handleSubmit(values: { email: string }) {
        setEmails([...emails, values.email])
    }
}
