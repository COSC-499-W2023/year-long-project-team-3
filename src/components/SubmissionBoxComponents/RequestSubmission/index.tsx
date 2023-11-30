import { Box, Icon, IconButton } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Add } from '@mui/icons-material'
import SubmissionRequestedCard from '@/components/SubmissionRequestedCard'
import React from 'react'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { useFormik } from 'formik'
import { useSession } from 'next-auth/react'

interface FormValues {
    email: string
}

type RequestSubmissionData = {
    emails: string[]
}

type RequestSubmissionProps = RequestSubmissionData & {
    updateFields: (fields: Partial<RequestSubmissionData>) => void
}

export default function RequestSubmission({ emails, updateFields }: RequestSubmissionProps) {
    const session = useSession()

    const ownerEmail: string = session.data?.user?.email!

    const removeEmail = (emailToRemove: string) => {
        const updatedEmails = emails.filter((email) => email !== emailToRemove)
        updateFields({ emails: updatedEmails })
        formik.setTouched({}, false)
    }

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        email: yup
            .string()
            .default('') // set default for checking inside onBlur and errors
            .required('To request a submission from someone, enter their email') // this will show up as a help text, not an error
            .matches(getEmailRegex(), 'Enter a valid email')
            .test('not-own-email', 'You cannot add your own email!', function (value) {
                return value !== ownerEmail
            })
            .test('unique', 'This email has already been added!', function (value) {
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
                        '& .MuiTextField-root': { my: 1.5, mx: 2, minWidth: '22rem', width: '100%' },
                    }}
                >
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type='email'
                        label='Email Address'
                        name='email'
                        value={formik.values.email}
                        onChange={(e) => {
                            formik.handleChange(e)
                        }}
                        onBlur={() => handleBlur()}
                        error={
                            formik.touched.email && Boolean(formik.errors.email) && Boolean(formik.values.email !== '') // error only when email not empty
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
            {/* This is a scrollable container for submission request cards */}
            <Box
                sx={{
                    maxHeight: '17rem',
                    height: '17rem',
                    width: '27rem',
                    overflow: 'auto',
                    p: 2,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                }}
            >
                {/* Add new cards for added submission requests and allow removal */}
                {emails.map((email, index) => (
                    <SubmissionRequestedCard key={index} email={email} removeEmail={removeEmail} />
                ))}
            </Box>
        </>
    )

    function handleBlur() {
        formik.handleBlur
        // if the user clicks out of the TextField and the TextField is empty, reset validation
        if (formik.values.email === '') {
            formik.setTouched({}, false)
        }
    }

    async function handleSubmit(values: { email: string }) {
        updateFields({ emails: [...emails, values.email] })
        formik.resetForm()
    }
}
