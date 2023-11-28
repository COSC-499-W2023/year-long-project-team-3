'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import React, { useState } from 'react'
import { Box, Icon, IconButton } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { Add } from '@mui/icons-material'
import Button from '@mui/material/Button'
import BackButton from '@/components/BackButton'
import MemberCard from '@/components/SubmissionMemberCard'

interface FormValues {
    email: string
}

export default function SubmissionBoxAddMembersPage() {
    const session = useSession()
    const router = useRouter()

    const ownerEmail: string = session.data?.user?.email!

    const [emails, setEmails] = useState<string[]>([])

    const removeEmail = (emailToRemove: string) => {
        const updatedEmails = emails.filter((email) => email !== emailToRemove)
        setEmails(updatedEmails)
        formik.setTouched({}, false)
    }

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        email: yup
            .string()
            .default('') // set default for checking inside onBlur and errors
            .required('To add a member, enter their email') // this will show up as a help text, not an error
            .matches(getEmailRegex(), 'Enter a valid email')
            .test('unique', 'This member has already been added!', function (value) {
                return !emails.includes(value) && value !== ownerEmail
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
            <BackButton route={'/submission-box/settings'} />
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
                    <ProgressDots activeStep={1} numSteps={3} labels={['Settings', 'Add Members', 'Create']} />
                </Box>
                <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                    <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                        Add Members
                    </Typography>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <Box
                            sx={{
                                px: 5,
                                pt: 5,
                                pb: 3,
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
                                onBlur={(e) => {
                                    formik.handleBlur(e)
                                    // if the user clicks out of the TextField and the TextField is empty, reset validation
                                    if (formik.values.email === '') {
                                        formik.setTouched({}, false)
                                    }
                                }}
                                error={
                                    formik.touched.email &&
                                    Boolean(formik.errors.email) &&
                                    Boolean(formik.values.email !== '') // error only when email not empty
                                }
                                // this ensures the layout does not get shifted by the helper text
                                FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                helperText={formik.touched.email && formik.errors.email}
                                data-cy='email'
                            />
                            <IconButton sx={{ backgroundColor: '#F5F5F5' }} type='submit' data-cy='add'>
                                <Icon>
                                    <Add />
                                </Icon>
                            </IconButton>
                        </Box>
                    </form>
                    {/* This is a scrollable container for member cards */}
                    <Box
                        sx={{
                            maxHeight: '17rem',
                            height: '17rem',
                            overflow: 'auto',
                            p: 2,
                            backgroundColor: '#F5F5F5',
                            borderRadius: 12,
                        }}
                    >
                        {/* This is the owner card, it cannot be removed */}
                        <MemberCard email={ownerEmail} role={'Owner'} isRemovable={false} removeEmail={removeEmail} />
                        {/* Add new cards for added members and allow removal */}
                        {emails.map((email, index) => (
                            <MemberCard
                                key={index}
                                email={email}
                                role={'Member'}
                                isRemovable={true}
                                removeEmail={removeEmail}
                            />
                        ))}
                    </Box>
                    <Button
                        variant='contained'
                        sx={{ mt: 5, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        onClick={() => handleNext()}
                        data-cy='next'
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </>
    )

    async function handleNext() {
        // TODO: send members data to API and do some error checking here
        emails.push(ownerEmail)
        console.log(emails)
        router.push('/submission-box/create')
    }

    async function handleSubmit(values: { email: string }) {
        setEmails([...emails, values.email])
        formik.resetForm()
    }
}
